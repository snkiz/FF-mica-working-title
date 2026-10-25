# CLAUDE.md: start here

Read this file first in every new chat, then read `TODO.md`. These two files are
the project's memory. Chats come and go; these files don't.
**If the files and your memory disagree, the files win.**

How the maintainer (snkiz) works with Claude is in `ABOUT-ME.md` in a private notes repo
(local: Documents\GitHub\Notes-n-Tools). Read that too if you can.

## The maintainer's rule

**I don't commit, push or post anything I can't understand.**

Every change Claude suggests comes with a plain-English explanation of what it
does, good enough for me to read it and decide. If I can't follow it, it waits.

Why: I don't trust Claude's output by default. Anything with my name on it is my
responsibility, even when Claude is the one who got it wrong. I'm here to learn and
get things done, not to have Claude do it for me (boilerplate aside).

## What this is

**FoxMica** (named 2026-10-04; was "FF-mica"): a Firefox theme for Windows 11. It puts the real Mica backdrop behind
FoxOne's one-line UI (tabs and URL bar in one row), with Windows 11 Explorer-style
tabs. Repo: https://github.com/snkiz/FoxMica (public, MIT). Local: Documents\GitHub\FoxMica.

- Built on FoxOne by Firnschnee (vendored unmodified, currently 3.9.9; 3.9.10 is out, not pulled yet).
- Mica rules come from Wintego's Firefox-transparent-theme (written for FoxOne 3.5).
- The look is matched by eye to Explorer with Windhawk's Explorer Styler "MicaBar" theme.

## The files (all go in the profile's `chrome` folder)

Load order is set in `userChrome.css` and it matters (later wins ties):

1. `foxone-mica.css`: **built file, never edit it.** FoxOne's `userChrome.css` as released (`vendor/`), with FoxMica's
   changes applied from `patches/userChrome/`: FoxOne's settings block cut down to the settings FoxMica doesn't set,
   then the Mica, layers, URL dropdown, bar-height and bookmarks-bar rules, in filename order.
2. `foxmica-config.css`: the one settings file (variables only). Shared by userChrome and userContent, so it must be in
   `chrome` in every mode. StockMica+ loads `micaplus-config.css` here instead; that file starts by importing
   `foxmica-config.css` and only holds the settings that differ.
3. `foxmica-tabs.css`: the Explorer-style tabs and bar height. Meant to work on stock Firefox too.
4. `userContent.css`: **built file, never edit it.** FoxOne's about: page styling (`vendor/userContent.css`) plus
   `patches/userContent/`. It imports the config.

`docs/` holds the longer pages the README links to (`docs/README.md` is the Settings page: how `userChrome.css` picks a flavour, with a table of contents for FoxOne-Mica and its settings, StockMica+ and OEM tabs). `docs/known-issues.md` is the long list, not linked from the README (the issue tracker is). The build instructions are `scripts/README.md`. `docs/` is in `export-ignore` (not in the release zip); the top of `CHANGELOG.md` links to it on GitHub and survives each clear. Keep the README short.

`userChrome.css` is the loader (the `@import` lines). It also has an optional, switched-off UI font block (the
maintainer uses Shantell Sans).

### Built files and the scripts

`vendor/` is FoxOne untouched (`vendor/VERSION` = the release), `patches/<target>/` is every FoxMica change to it
(`.patch` = find-and-replace hunks, `.css` = blocks added to the end, both in filename order), and `VERSION` in the
root is FoxMica's own version (`0.9.1`, 2026-10-21). Details and the patch format: `scripts/README.md`.

- To change a built file, change a patch, then `node scripts/assemble.mjs`. A hand edit to a built file is lost on the
  next build, and `node scripts/check.mjs` reports it with the first line that differs.
- Update FoxOne: `node scripts/pull-foxone.mjs <tag>`, then assemble. A patch that no longer applies stops the build
  and says which hunk and line.
- Before every commit that touches CSS: `node scripts/check.mjs --offline`. Before a release: bump `VERSION`, assemble,
  `node scripts/check.mjs` (online, also checks `vendor/` against the real release), commit the rebuilt files.

## Where things stand (update this section at the end of every session)

**Last updated:** 2026-10-24

- **0.9.1 (2026-10-21)** on FoxOne 3.9.9; `VERSION` is `0.9.1`. Three modes, picked in `userChrome.css`: **FoxOne-Mica**
  (the full theme, default), **StockMica+** (Firefox's own two rows with FoxMica's look; `micaplus-config.css`, which
  chain-loads `foxmica-config.css`) and **OEM drop-in replacement tabs** (just `foxmica-tabs.css`). `foxmica-plus.css`
  is gone. New patches: 44 (find bar below the floating bookmarks bar), 46 (`--ut-one-line: 0`, the two rows), 47
  (title-bar icons hide only while the puzzle is pinned), 48 (drawer that follows an unpinned puzzle). Puzzle colour
  lives in `foxmica-tabs.css` (every mode). Pinstripe default: off in modes 1 and 2, on in mode 3. PWAsForFirefox windows
  work in StockMica+ with `--uc-extensions-button-right: 1`. Earlier 0.8 "Brick by Brick" did the five-file refactor (#21).
- **Unreleased, 2026-10-24:** `42-delays.css` adds 100ms to the bookmarks-bar hide delay (150ms by default). FoxOne 3.9.10
  is out ("Aim for the text": reveal only on the URL text, #59) and not pulled yet. Patch 26 is still needed (FoxOne's
  `--uc-row-height` defaults to Firefox's tab-strip height, not our bar height).
- **Road to 1.0:** a full test pass of every mode with screenshots
  (four views: the three modes and PWA windows), then the FirefoxCSS Store submission (#30). The five-colour palette (#26)
  is after 1.0. ESR 153 stays unsupported and is not a blocker (td39 tab text, #38; #37 URL bar widening). Upstream ideas for Firn after a few days with 0.9.1 are in TODO.md. Open: td40 (FoxOne accent vs dynamic
  themes), README fixes next release, light-system dark bar on the default theme (suspected registry tweaks and/or
  Windhawk; to test in a sandbox).
- Lessons: a user stylesheet can't use Nova's `border-area` clip; Firefox only rereads userChrome at startup;
  `widget.windows.mica.toplevel-backdrop` = 2 makes the strip black; a `*/` inside a header comment ends it early and
  silently kills the next rule; a style query on `:root` has no ancestor container, so switches are set on
  `#navigator-toolbox` (as FoxOne does).
- **Released 0.7 "Better together"** on FoxOne 3.9.1 (merge tracked in #33; branch `3.9.1-upstream-pull`, rebased
  on 3.9.1). Earlier: 0.5 "Warts and all". Tags have no "v". Fixes go out as point releases until 1.0. A release is
  pinned to its tag: push first, then publish. Release zip leaves out dev files via `export-ignore` in .gitattributes.
- Upstream: three FoxMica overrides landed in FoxOne 3.9.1 (nav hover delay, hide disabled Back/Forward, URL-bar
  icon reveals; FoxOne #54, #55, #58, #59), so our 7b/7c overrides are gone. Find-bar fix and `--uc-row-height`
  landed in 3.8.8. FoxMica keeps click-to-cancel (override 7e), Forward-only hiding, and the trust-label and PiP
  switches.
- Issues #1-#34 are on GitHub. `TODO.md` maps items to issue numbers. Items are `tdN`, issues are `#N`; never a bare number.
- Built and hand-tested on Nightly 160 with Nova on (the default) and off; ESR 153 tested preliminarily for 0.8.
  Proton/old look is a dead end.
- Daily browser is ESR 140. Plan: get Nightly right, then move to ESR 153 (has the Nova switch) and backport (#22).
- Nightly has dropped `browser.compactmode.show`; density is now set in about:settings (td34).

### td26 (solved): how it was found

- `.tab-background` still exists under Nova, inside `.tab-stack`, and has `selected`.
- Our rule `:root .tabbrowser-tab:is([selected],[multiselected]) .tab-background`
  matches (Browser Toolbox lists it), but `background-color` shows struck out.
  So did a plain `lime !important` probe.
- Probes: colour on `.tabbrowser-tab` and `.tab-content` shows on screen. Colour on
  `.tab-stack` and a background-image on `.tab-background` did not.
- Checked 2026-10-04: **nothing in our six files should beat our rule.** FoxOne's
  `.tabbrowser-tab[selected] .tab-background { transparent !important }` is less
  specific and loads earlier. So the winner is most likely Firefox's own Nova styling,
  or `.tab-background` isn't visible under Nova (size, opacity, covered).
- Not yet done: read the Computed panel for `.tab-background` (background-color,
  expand it) to see which rule actually wins, plus its size, opacity and visibility.
  Untested idea: paint the fill on `.tabbrowser-tab` itself for Nova.
- Chat 1 was answering this when it ran out of tokens; its answer was lost.
- **Likely cause found 2026-10-04** by reading Nightly 159's own `tabs.css` (from
  `omni.ja`): under Nova, with a built-in theme (`:root[theme-in-app]`), the selected
  `.tab-background` gets a `background` shorthand with `background-clip: border-area`
  (for Nova's gradient border). We remove the border, so the fill is clipped to
  nothing. Fix added: `background-clip: border-box !important` on our selected-tab
  rule in `foxmica-tabs.css`. **Confirmed working, same day.**
- Separators (25) came back with the same fix.

## Decisions (and why)

- FoxOne stays unmodified in `vendor/` so it can be updated by pulling a new release; our changes are patches on top.
  The built files carry a header saying so, and `check.mjs` catches hand edits.
- One config file for chrome and content so the palettes can't drift apart.
- Two layers like Explorer: plain Mica strip on top; selected tab, bookmarks bar
  and sidebar share one layer (`--ut-layer`).
- Floating bookmarks bar is a translucent grey (`--ut-bookmarks-bg`, about 78-85% opaque; Mica can't paint over page pixels, so it is a fixed colour, not Mica). Wintego's
  in-flow bar was dropped because it pushes the page down.
- Pinned extensions: placement is the switch. Only the unbroken run of extensions beside the hamburger hides behind
  the hamburger hover; anywhere else (nav-bar, or before the tabs) they always show. Firefox's own tools never hide
  (they have the overflow). Intended; don't "fix" it. The before-the-tabs trap was fixed upstream in FoxOne 3.9.4
  (#62, our fix, accepted as #63), which also fixed the Customize overrun (#32).
- Download button is not pinned. The overflow chevron stays where Firefox puts it.
- Condensed to five files (done, #21): pull upstream, patch it, build something leaner.
  Every feature must still be switchable on its own (needed for "stock-plus" mode and
  for testing each feature off). Upstream can take or leave any of it.

## Testing setup

- Nightly test profile (fresh, Nova on by default) and a "good" Nightly profile.
- Fully restart Firefox after CSS changes; `about:support` has "Clear startup cache".
- Browser Toolbox: `devtools.chrome.enabled` + `devtools.debugger.remote-enabled`,
  then Ctrl+Alt+Shift+I.
- Laptop is NVIDIA Optimus. Mica flicker has been driver trouble before; rule that
  out before blaming CSS. A flash on every hover (2026-10-17) went away after restarting
  Explorer (the Windows desktop shell), so try that too.

## Public repo

This repo is public. Keep personal details (real name, location, health, anything
from ABOUT-ME.md) out of every file here, including notes and issue text.

## End of a session

Before closing a chat, update "Where things stand" and `TODO.md`, then commit in
GitHub Desktop **and click Push origin** (top bar). Commit alone only saves locally.
A new chat should be able to pick up from these files alone.
