# scripts/

Small Node scripts (no packages to install, Node 18 or newer) that keep FoxOne's files and FoxMica's changes to them
apart. Run them from the repo root.

## The idea

FoxMica is built on FoxOne, and I don't want to hand-edit FoxOne's files and lose track of what changed. So:

- `vendor/` holds FoxOne's files exactly as released. Never edit them. `vendor/VERSION` says which release.
- `patches/` holds every change FoxMica makes to them, one small file per change, each with a note on why.
- Two files in the repo root are **built** from those two and carry a `BUILT FILE - do not edit by hand` header:
  - `foxone-mica.css` is `vendor/userChrome.css` plus `patches/userChrome/`.
  - `userContent.css` is `vendor/userContent.css` plus `patches/userContent/`.
- Everything else in the root (`userChrome.css`, `foxmica-config.css`, `foxmica-tabs.css`) is written by hand.

To change a built file, change a patch, then rebuild. A hand edit to a built file is lost on the next build, and
`check.mjs` will tell you about it.

## The scripts

| Command | What it does | Changes files? |
| --- | --- | --- |
| `node scripts/pull-foxone.mjs 3.9.5` | Downloads FoxOne release 3.9.5 into `vendor/` and updates `vendor/VERSION`. | `vendor/` only |
| `node scripts/assemble.mjs` | Applies the patches to `vendor/` and writes the built files. If any patch fails, nothing is written. | The built files |
| `node scripts/check.mjs` | Checks `vendor/` matches the release in `VERSION`, every patch applies, and the built files are up to date. | No |
| `node scripts/check.mjs --offline` | The same, without the download (skips the `vendor/` check). | No |
| `node scripts/make-patch.mjs <original> <edited> <patch>` | Writes a patch from the difference between two files. | The new patch only |

`check.mjs` exits with an error if anything is wrong, so it is safe to run before a release.

## Everyday routines

**Change something FoxMica does to FoxOne's file**: edit the patch (or add one), then `node scripts/assemble.mjs`,
then `node scripts/check.mjs --offline`.

**Make a patch from an edit**: copy the file you want to change, edit the copy in Notepad++, then
`node scripts/make-patch.mjs vendor/userContent.css my-edited-copy.css patches/userContent/20-what-it-does.patch`.
It refuses to overwrite an existing patch. Open the result and fill in the `# Why:` line.

**Update to a new FoxOne release**: `node scripts/pull-foxone.mjs <tag>`, then `node scripts/assemble.mjs`. If a patch
no longer applies, the build stops and says which one (see below). Fix that patch and run assemble again. When it
builds, run `node scripts/check.mjs`, then test in a dev profile before committing.

## Patch files

Patches live in `patches/userChrome/` and `patches/userContent/` and are applied in filename order, so number them
(`10-`, `20-`, ...). There are two kinds:

**`.patch`: find and replace.** One file can hold several hunks:

    # Why: one line on why this change exists. Lines starting with # outside a hunk are notes.
    <<<<<<< FIND
    the exact text in FoxOne's file
    =======
    the text to put there instead
    >>>>>>> REPLACE

The FIND text has to occur **exactly once** in the file being patched, including spaces. Include a line or two of
neighbours if the first try matches in several places. The REPLACE text is used as written.

**`.css`: appended.** The whole file is added to the end of the built file, after all the `.patch` hunks. This is
for new blocks (the Mica overrides, say) rather than edits to FoxOne's own lines.

## When something fails

Failures name the patch file, the line the hunk starts on, and the first line of the text it was looking for:

    PROBLEM  userChrome: 20.patch line 7 (hunk 2): the FIND text occurs 0 times, it must be exactly 1.
               It starts with: --uc-example: 1;
               That first line is at line 212 of the file being patched; the lines after it have changed.

- **occurs 0 times**: FoxOne changed that text (usually after a `pull-foxone`). Open `vendor/` at the line given,
  see what it says now, and update the FIND text.
- **occurs 2 or more times**: the FIND text is too short. Add neighbouring lines to it.
- **is out of date or was edited by hand**: `check.mjs` also gives the first line that differs. If you meant to change
  the built file, put the change in a patch. If you didn't, run `node scripts/assemble.mjs` to rebuild it.
- **vendor/ does not match the release**: something edited `vendor/`. Run `node scripts/pull-foxone.mjs <the tag in
  VERSION>` to put it back.

## Line endings

Everything is read with Windows line endings turned into Unix ones, and built files are written with Unix endings
(the repo's `.gitattributes` does the same), so saving a patch in Notepad++ on Windows won't break a match.
