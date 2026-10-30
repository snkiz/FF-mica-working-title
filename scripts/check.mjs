// check.mjs: say whether vendor/, patches/ and the built files are all still in step.
//
// Usage (from the repo root):   node scripts/check.mjs            (needs the internet for the first check)
//                               node scripts/check.mjs --offline  (skips the first check)
//
// It checks five things:
//   1. vendor/ is byte-for-byte the FoxOne release named in vendor/VERSION.
//   2. every patch applies to the vendored file (each FIND text occurs exactly once).
//   3. the built files in the repo are what vendor + patches produce right now, so nobody has
//      edited a built file by hand or forgotten to rebuild.
//   4. every CSS file has matching { and }, and so does each built file as the patches produce it. A missing
//      or extra brace gives no error anywhere: the browser just drops every rule after it.
//   5. a release (a FoxMica VERSION with no -dev) is not built on a pre-release FoxOne copy (a vendor/VERSION
//      with a +).
//
// Changes nothing. Exits with an error if anything fails, so it can also run before a release.

import { readdir } from "node:fs/promises";
import { TARGETS, UPSTREAM, build, firstDifference, readText } from "./patchlib.mjs";

const offline = process.argv.includes("--offline");
let failures = 0;
const ok = (msg) => console.log(`ok    ${msg}`);
const fail = (msg) => {
  failures++;
  console.error(`FAIL  ${msg}`);
};

// 1. vendor/ against the real release
const version = (await readText("vendor/VERSION")).trim();
if (offline) {
  console.log(`skip  vendor/ against the FoxOne ${version} release (--offline)`);
} else if (version.includes("+")) {
  // "4.0.2+pr83" means a release plus an unreleased FoxOne pull request, which is not a tag to fetch.
  // Put the plain release number back in vendor/VERSION when Firn releases it.
  console.log(`skip  vendor/ against the FoxOne release: ${version} is not a release (a pre-release copy)`);
} else {
  for (const name of ["userChrome.css", "userContent.css"]) {
    try {
      const res = await fetch(`${UPSTREAM}/${version}/${name}`);
      if (!res.ok) {
        fail(`could not fetch ${name} for FoxOne ${version} (HTTP ${res.status})`);
        continue;
      }
      const theirs = (await res.text()).replace(/\r\n/g, "\n");
      if (theirs === (await readText(`vendor/${name}`))) ok(`vendor/${name} is FoxOne ${version}, untouched`);
      else fail(`vendor/${name} is NOT the same as FoxOne ${version}`);
    } catch (e) {
      fail(`could not reach GitHub for ${name}: ${e.message}`);
    }
  }
}

// 2 and 3. patches apply, built files are current
for (const target of TARGETS) {
  const r = await build(target);
  for (const f of r.other) console.warn(`note  ${target.patchDir}/${f} is not a .patch or .css file, so it is ignored`);
  if (r.problems.length) {
    r.problems.forEach((p) => fail(`${target.name}: ${p}`));
    continue;
  }
  ok(`${target.name}: ${r.applied} patch(es) apply cleanly, ${r.appended} block(s) added`);

  let current = null;
  try {
    current = await readText(target.out);
  } catch {
    // missing file, reported below
  }
  if (current === null) fail(`${target.out} is missing: run  node scripts/assemble.mjs`);
  else if (current !== r.text) {
    const d = firstDifference(r.text, current);
    fail(
      `${target.out} is out of date or was edited by hand: run  node scripts/assemble.mjs\n` +
        `        First difference at line ${d.line}:\n` +
        `          vendor + patches give: ${d.expected.trim()}\n` +
        `          the file has:          ${d.found.trim()}`,
    );
  } else ok(`${target.out} is up to date`);
}

// 4. braces: every CSS file of ours, and each built file as vendor + patches produce it, has matching { and }.
// A missing or extra brace gives no error anywhere; the browser silently drops every rule after it.

// Walks the CSS text and says, in plain words, what the first brace problem is (or null if they all match).
// Braces inside /* comments */ and "quoted strings" don't count. Needs: the CSS text. Sets: nothing.
function findBraceProblem(css) {
  const opens = []; // the line number of each { that is still waiting for its }
  let line = 1;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === "\n") {
      line++;
    } else if (c === "/" && css[i + 1] === "*") {
      // a comment: jump to its end, keeping the line count right
      const end = css.indexOf("*/", i + 2);
      if (end === -1) return `the comment starting on line ${line} is never closed`;
      line += css.slice(i, end).split("\n").length - 1;
      i = end + 1;
    } else if (c === '"' || c === "'") {
      // a quoted string: jump to its closing quote (or stop at the end of the line)
      let j = i + 1;
      while (j < css.length && css[j] !== c && css[j] !== "\n") j += css[j] === "\\" ? 2 : 1;
      i = css[j] === "\n" ? j - 1 : j;
    } else if (c === "{") {
      opens.push(line);
    } else if (c === "}") {
      if (opens.length === 0) return `an extra } on line ${line} has no { to close`;
      opens.pop();
    }
  }
  if (opens.length) return `the { on line ${opens.at(-1)} is never closed`;
  return null;
}

// The files to look at: the .css files in the repo root, and the .css blocks in each patch folder.
// (The .patch files hold pieces of rules, so their braces are judged in the built result below.)
const cssFiles = (await readdir(".")).filter((f) => f.endsWith(".css"));
for (const target of TARGETS) {
  const blocks = (await readdir(target.patchDir)).filter((f) => f.endsWith(".css"));
  cssFiles.push(...blocks.map((f) => `${target.patchDir}/${f}`));
}

const failuresBefore = failures;
for (const file of cssFiles) {
  const problem = findBraceProblem(await readText(file));
  if (problem) fail(`${file}: ${problem}`);
}
for (const target of TARGETS) {
  const built = await build(target);
  if (!built.text) continue; // the patch problems were already reported above
  const problem = findBraceProblem(built.text);
  if (problem) fail(`${target.out} as vendor + patches build it: ${problem}`);
}
if (failures === failuresBefore) ok(`braces match in ${cssFiles.length} CSS file(s) and ${TARGETS.length} built result(s)`);

// 5. a release must not ship a pre-release FoxOne copy. FoxMica's VERSION ends in -dev between releases and the
// release step removes it. If vendor/VERSION still has a + (a FoxOne release plus an unreleased pull request) at
// that point, stop: a tag would point at a FoxOne nobody can fetch.
const foxmicaVersion = (await readText("VERSION")).trim();
if (version.includes("+") && !foxmicaVersion.includes("-")) {
  fail(
    `VERSION is ${foxmicaVersion}, a release, but vendor/VERSION is ${version}, a pre-release FoxOne copy: ` +
      "wait for the FoxOne release and put it in vendor/ first",
  );
} else if (version.includes("+")) {
  ok(`VERSION ${foxmicaVersion} is a dev version, so the pre-release FoxOne copy (${version}) is fine for now`);
}
console.log(failures === 0 ? "\nAll good." : `\n${failures} problem(s).`);
process.exit(failures === 0 ? 0 : 1);
