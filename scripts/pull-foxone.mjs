// pull-foxone.mjs: fetch one FoxOne release into vendor/, untouched.
//
// Usage (from the repo root):   node scripts/pull-foxone.mjs 3.9.4
//
// Why: vendor/ holds FoxOne exactly as released. Nothing of ours goes in it, so a new release
// is one clean, reviewable change. Our changes live elsewhere and are applied on top.
//
// This script only downloads and reports. It does not commit or push anything: read the
// diff in GitHub Desktop and decide.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const UPSTREAM = "https://raw.githubusercontent.com/Firnschnee/FoxOne";
const FILES = ["userChrome.css", "userContent.css"]; // the upstream files we vendor
const VENDOR_DIR = "vendor";

const tag = process.argv[2];

// FoxOne's tags are plain version numbers (3.9.4, no "v"). Refuse anything else so a typo
// can't download the wrong thing.
if (!tag || !/^\d+(\.\d+)*$/.test(tag)) {
  console.error("Give a FoxOne version, like:  node scripts/pull-foxone.mjs 3.9.4");
  process.exit(1);
}

// Download everything first and write nothing until all of it arrived, so a failed download
// can't leave vendor/ half old and half new.
const downloaded = [];
for (const name of FILES) {
  const url = `${UPSTREAM}/${tag}/${name}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Could not fetch ${url} (HTTP ${res.status}). Is "${tag}" a real FoxOne tag?`);
    process.exit(1);
  }
  // Keep the bytes exactly as sent; no line-ending or encoding changes.
  downloaded.push({ name, data: Buffer.from(await res.arrayBuffer()) });
}

await mkdir(VENDOR_DIR, { recursive: true });

for (const { name, data } of downloaded) {
  const path = join(VENDOR_DIR, name);
  let old = null;
  try {
    old = await readFile(path);
  } catch {
    // no earlier copy: this is a first pull
  }
  const status = old === null ? "new" : old.equals(data) ? "unchanged" : "CHANGED";
  await writeFile(path, data);
  console.log(`${status.padEnd(9)} ${path}`);
}

// Remember which release vendor/ holds, so the folder says so without anyone guessing.
await writeFile(join(VENDOR_DIR, "VERSION"), `${tag}\n`);
console.log(`vendor/ is now FoxOne ${tag}. Review the diff in GitHub Desktop before committing.`);
