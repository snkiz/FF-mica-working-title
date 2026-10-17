// check.mjs: say whether vendor/, patches/ and the built files are all still in step.
//
// Usage (from the repo root):   node scripts/check.mjs            (needs the internet for the first check)
//                               node scripts/check.mjs --offline  (skips the first check)
//
// It checks three things:
//   1. vendor/ is byte-for-byte the FoxOne release named in vendor/VERSION.
//   2. every patch applies to the vendored file (each FIND text occurs exactly once).
//   3. the built files in the repo are what vendor + patches produce right now, so nobody has
//      edited a built file by hand or forgotten to rebuild.
//
// Changes nothing. Exits with an error if anything fails, so it can also run before a release.

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

console.log(failures === 0 ? "\nAll good." : `\n${failures} problem(s).`);
process.exit(failures === 0 ? 0 : 1);
