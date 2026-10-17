// assemble.mjs: build our FoxOne-based files from vendor/ plus patches/.
//
// Usage (from the repo root):   node scripts/assemble.mjs
//
// Why: the files FoxMica ships on top of FoxOne are never edited by hand. They are made from the
// untouched FoxOne file in vendor/ and our changes in patches/, so a new FoxOne release is one
// pull (scripts/pull-foxone.mjs) and one rebuild, and every change of ours is a small file you can read.
//
// All files are built in memory first; if any patch fails to apply, nothing is written and the
// failing patch is named. It does not commit or push anything.

import { writeFile } from "node:fs/promises";
import { TARGETS, build } from "./patchlib.mjs";

const results = [];
for (const target of TARGETS) results.push({ target, result: await build(target) });

let failed = false;
for (const { target, result } of results) {
  for (const p of result.problems) {
    console.error(`PROBLEM  ${target.name}: ${p}`);
    failed = true;
  }
  for (const f of result.other) console.warn(`note     ${target.patchDir}/${f} is not a .patch or .css file, so it is ignored`);
}
if (failed) {
  console.error("Nothing was written.");
  process.exit(1);
}

for (const { target, result } of results) {
  await writeFile(target.out, result.text);
  console.log(`built ${target.out}: ${result.applied} patch(es), ${result.appended} block(s) added`);
}
