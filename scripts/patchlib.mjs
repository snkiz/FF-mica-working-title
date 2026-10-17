// patchlib.mjs: the shared part of assemble.mjs, check.mjs and make-patch.mjs.
//
// A built file is made from an untouched FoxOne file in vendor/ plus our changes in patches/:
//
//   patches/<target>/*.patch   small find-and-replace edits, applied in filename order
//   patches/<target>/*.css     whole blocks of CSS, added to the end in filename order
//
// Built files are never edited by hand. Change a patch, run scripts/assemble.mjs, and the built
// file follows. scripts/check.mjs says whether everything is still in step.
//
// A .patch file holds one or more hunks. Lines starting with # outside a hunk are notes:
//
//   <<<<<<< FIND
//   the exact text to look for (it must occur exactly once in the file)
//   =======
//   the text to put there instead
//   >>>>>>> REPLACE

import { readFile, readdir } from "node:fs/promises";
import { basename } from "node:path";

export const UPSTREAM = "https://raw.githubusercontent.com/Firnschnee/FoxOne";

// One entry per built file: where its FoxOne original is, where the result goes, where its patches are.
export const TARGETS = [
  { name: "userChrome", vendor: "vendor/userChrome.css", out: "foxone-mica.css", patchDir: "patches/userChrome" },
  { name: "userContent", vendor: "vendor/userContent.css", out: "userContent.css", patchDir: "patches/userContent" },
];

// Read a text file with Unix line endings, whatever it was saved with.
export async function readText(path) {
  return (await readFile(path, "utf8")).replace(/\r\n/g, "\n");
}

// How many times does needle occur in text (not counting overlaps)?
export function countOccurrences(text, needle) {
  let count = 0;
  for (let i = text.indexOf(needle); i !== -1; i = text.indexOf(needle, i + needle.length)) count++;
  return count;
}

// Which line of the text does this character position fall on (counting from 1)?
export function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

// Where do two texts first disagree? Returns null if they are the same.
export function firstDifference(expected, found) {
  const a = expected.split("\n");
  const b = found.split("\n");
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) return { line: i + 1, expected: a[i] ?? "(the file ends)", found: b[i] ?? "(the file ends)" };
  }
  return null;
}

// Turn the text of a .patch file into a list of { find, replace, n, line } hunks.
export function parsePatch(text, fileName) {
  const hunks = [];
  let state = "outside";
  let startLine = 0; // where the current hunk begins in the patch file
  let find = [];
  let replace = [];
  text.replace(/\r\n/g, "\n").split("\n").forEach((line, i) => {
    const where = `${fileName} line ${i + 1}`;
    if (state === "outside") {
      if (line === "<<<<<<< FIND") {
        state = "find";
        startLine = i + 1;
        find = [];
        replace = [];
      } else if (line.trim() !== "" && !line.startsWith("#")) {
        throw new Error(`${where}: text outside a hunk (notes must start with #)`);
      }
    } else if (state === "find") {
      if (line === "=======") state = "replace";
      else find.push(line);
    } else if (line === ">>>>>>> REPLACE") {
      if (find.join("\n") === "") throw new Error(`${where}: the FIND part is empty`);
      hunks.push({ find: find.join("\n"), replace: replace.join("\n"), n: hunks.length + 1, line: startLine });
      state = "outside";
    } else {
      replace.push(line);
    }
  });
  if (state !== "outside") throw new Error(`${fileName}: a hunk is never closed`);
  return hunks;
}

// Apply hunks one after another. Every FIND must match exactly once; anything else is reported, not guessed at.
export function applyHunks(text, hunks, fileName) {
  const problems = [];
  for (const h of hunks) {
    const count = countOccurrences(text, h.find);
    if (count !== 1) {
      const first = h.find.split("\n").find((l) => l.trim() !== "") ?? "";
      let msg = `${fileName} line ${h.line} (hunk ${h.n}): the FIND text occurs ${count} times, it must be exactly 1.`;
      msg += `\n           It starts with: ${first.trim()}`;
      if (count === 0) {
        // The whole block is gone, but its first line may still be there: say where, so you can see what changed.
        const at = text.indexOf(first);
        if (first.trim().length > 8 && at !== -1) {
          msg += `\n           That first line is at line ${lineOf(text, at)} of the file being patched; the lines after it have changed.`;
        } else {
          msg += `\n           That first line was not found (or is too short to locate); the text has changed.`;
        }
      }
      problems.push(msg);
      continue;
    }
    const at = text.indexOf(h.find);
    // Cut and join by position, so $ characters in the replacement are never treated specially.
    text = text.slice(0, at) + h.replace + text.slice(at + h.find.length);
  }
  return { text, problems };
}

async function listDir(dir) {
  try {
    return (await readdir(dir)).sort();
  } catch {
    return []; // no patches yet for this file
  }
}

// Build one target: vendor file, then its .patch edits, then its .css blocks, under a short header.
// Returns the result and a list of problems; nothing is written here.
export async function build(target) {
  const problems = [];
  let text;
  let version;
  try {
    text = await readText(target.vendor);
    version = (await readText("vendor/VERSION")).trim();
  } catch (e) {
    return { text: "", problems: [`cannot read ${target.vendor} or vendor/VERSION: ${e.message}`], applied: 0, appended: 0, other: [] };
  }

  const files = await listDir(target.patchDir);
  const edits = files.filter((f) => f.endsWith(".patch"));
  const blocks = files.filter((f) => f.endsWith(".css"));
  const other = files.filter((f) => !f.endsWith(".patch") && !f.endsWith(".css"));

  for (const f of edits) {
    try {
      const hunks = parsePatch(await readText(`${target.patchDir}/${f}`), f);
      const r = applyHunks(text, hunks, f);
      text = r.text;
      problems.push(...r.problems);
    } catch (e) {
      problems.push(e.message);
    }
  }

  if (!text.endsWith("\n")) text += "\n";
  for (const f of blocks) {
    text += "\n" + (await readText(`${target.patchDir}/${f}`)).trimEnd() + "\n";
  }

  const header =
    `/* BUILT FILE - do not edit by hand.\n` +
    `   Made by scripts/assemble.mjs from vendor/${basename(target.vendor)} (FoxOne ${version}) plus ${target.patchDir}/.\n` +
    `   Change the patches, then rebuild. */\n`;
  return { text: header + text, problems, applied: edits.length, appended: blocks.length, other };
}
