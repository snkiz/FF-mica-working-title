// make-patch.mjs: write a patch file from "the FoxOne file" and "my edited copy of it".
//
// Usage (from the repo root):
//   node scripts/make-patch.mjs vendor/userContent.css my-edited-copy.css patches/userContent/20-my-change.patch
//
// Why: patches are small find-and-replace hunks (see patchlib.mjs for the format). Rather than write
// them by hand, copy the vendored file somewhere, edit the copy in your editor as usual, and let this
// work out the hunks. Each hunk carries a few lines either side so its FIND text is unique.
//
// It checks its own work: it applies the hunks back onto the original and refuses to write the
// patch unless the result is exactly your edited copy. It will not overwrite an existing patch.

import { writeFile, access } from "node:fs/promises";
import { applyHunks, countOccurrences, readText } from "./patchlib.mjs";

const [originalPath, editedPath, patchPath] = process.argv.slice(2);
if (!originalPath || !editedPath || !patchPath) {
  console.error("Usage: node scripts/make-patch.mjs <original> <edited copy> <patch file to write>");
  process.exit(1);
}
const exists = await access(patchPath).then(() => true, () => false);
if (exists) {
  console.error(`${patchPath} already exists. Pick another name, or delete it first.`);
  process.exit(1);
}

const original = await readText(originalPath);
const edited = await readText(editedPath);
const a = original.split("\n");
const b = edited.split("\n");

// Find the runs of lines that differ. Work only on the part between the shared start and shared end.
function changedRegions(a, b) {
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let end = 0;
  while (end < a.length - start && end < b.length - start && a[a.length - 1 - end] === b[b.length - 1 - end]) end++;
  const A = a.slice(start, a.length - end);
  const B = b.slice(start, b.length - end);

  // Longest common subsequence table: how many lines the rest of A and B still have in common.
  const common = Array.from({ length: A.length + 1 }, () => new Uint32Array(B.length + 1));
  for (let i = A.length - 1; i >= 0; i--) {
    for (let j = B.length - 1; j >= 0; j--) {
      common[i][j] = A[i] === B[j] ? common[i + 1][j + 1] + 1 : Math.max(common[i + 1][j], common[i][j + 1]);
    }
  }

  // Walk both files together; every stretch where they disagree is one region.
  const regions = [];
  let i = 0;
  let j = 0;
  let open = null;
  while (i < A.length || j < B.length) {
    if (i < A.length && j < B.length && A[i] === B[j]) {
      if (open) regions.push(open);
      open = null;
      i++;
      j++;
      continue;
    }
    open ??= { aStart: start + i, aEnd: start + i, bStart: start + j, bEnd: start + j };
    if (j < B.length && (i >= A.length || common[i][j + 1] >= common[i + 1][j])) {
      j++;
      open.bEnd = start + j;
    } else {
      i++;
      open.aEnd = start + i;
    }
  }
  if (open) regions.push(open);
  return regions;
}

// Regions that sit close together become one hunk, so their context doesn't overlap.
const CONTEXT = 3;
const merged = [];
for (const r of changedRegions(a, b)) {
  const last = merged[merged.length - 1];
  if (last && r.aStart - last.aEnd <= 2 * CONTEXT) {
    last.aEnd = r.aEnd;
    last.bEnd = r.bEnd;
  } else {
    merged.push({ ...r });
  }
}

// Build each hunk with as little surrounding context as makes its FIND text unique.
const hunks = [];
for (const r of merged) {
  let found = null;
  for (let k = CONTEXT; k <= 60 && !found; k++) {
    const from = Math.max(0, r.aStart - k);
    const to = Math.min(a.length, r.aEnd + k);
    const find = a.slice(from, to).join("\n");
    if (countOccurrences(original, find) === 1) {
      const replace = [...a.slice(from, r.aStart), ...b.slice(r.bStart, r.bEnd), ...a.slice(r.aEnd, to)].join("\n");
      found = { find, replace, n: hunks.length + 1 };
    }
  }
  if (!found) {
    console.error(`Could not make a unique FIND for the change near line ${r.aStart + 1}.`);
    process.exit(1);
  }
  hunks.push(found);
}

// Prove it: applying the hunks to the original must give back the edited copy, exactly.
const check = applyHunks(original, hunks, patchPath);
if (check.problems.length || check.text !== edited) {
  console.error("The hunks do not reproduce your edited copy exactly, so nothing was written.");
  check.problems.forEach((p) => console.error("  " + p));
  process.exit(1);
}

const out = [
  `# ${patchPath.split(/[\\/]/).pop()}`,
  `# Made by scripts/make-patch.mjs from ${originalPath} and ${editedPath}.`,
  `# Why: (say in one line what this change is for)`,
  "",
  ...hunks.flatMap((h) => ["<<<<<<< FIND", h.find, "=======", h.replace, ">>>>>>> REPLACE", ""]),
].join("\n");
await writeFile(patchPath, out);
console.log(`wrote ${patchPath}: ${hunks.length} hunk(s). Open it and fill in the "Why" line.`);
