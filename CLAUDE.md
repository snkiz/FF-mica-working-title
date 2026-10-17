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

- Built on FoxOne by Firnschnee (vendored unmodified, currently 3.9.4).
- Mica rules come from Wintego's Firefox-transparent-theme (written for FoxOne 3.5).
- The look is matched by eye to Explorer with Windhawk's Explorer Styler "MicaBar" theme.

## The files (all go in the profile's `chrome` folder)

Load order is set in `userChrome.css` and it matters (later wins ties):

1. `userChrome-foxone.css`: FoxOne exactly as released. **Never edit it.** Fixes go in the overrides.
2. `foxmica-config.css`: the one settings file (variables only). Shared by userChrome and userContent.
3. `foxmica-tabs.css`: the Explorer-style tabs and bar height. Meant to work on stock Firefox too.
4. `foxmica-overrides.css`: Mica, layers, URL dropdown fix, bar-height fixes, bookmarks bar.
5. `userContent.css`: FoxOne's about: page styling with our edits, imports the config.

`userChrome.css` also has an optional, switched-off UI font block (the maintainer uses Shantell Sans).

## Where things stand (update this section at the end of every session)

**Last updated:** 2026-10-12

- **Released 0.7 "Better together"** on FoxOne 3.9.1 (merge tracked in #33; branch `3.9.1-upstream-pull`, rebased
  on 3.9.1). Earlier: 0.5 "Warts and all". Tags have no "v". Fixes go out as point releases until 1.0. A release is
  pinned to its tag: push first, then publish. Release zip leaves out dev files via `export-ignore` in .gitattributes.
- Upstream: three FoxMica overrides landed in FoxOne 3.9.1 (nav hover delay, hide disabled Back/Forward, URL-bar
  icon reveals; FoxOne #54, #55, #58, #59), so our 7b/7c overrides are gone. Find-bar fix and `--uc-row-height`
  landed in 3.8.8. FoxMica keeps click-to-cancel (override 7e), Forward-only hiding, and the trust-label and PiP
  switches.
- Issues #1-#34 are on GitHub. `TODO.md` maps items to issue numbers. Items are `tdN`, issues are `#N`; never a bare number.
- Built and hand-tested on Nightly 160 with Nova on (the default) and off. Proton/old look is a dead end.
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

- FoxOne stays unmodified so it can be updated by dropping in a new release.
- One config file for chrome and content so the palettes can't drift apart.
- Two layers like Explorer: plain Mica strip on top; selected tab, bookmarks bar
  and sidebar share one layer (`--ut-layer`).
- Floating bookmarks bar is solid (Mica can't paint over page pixels). Wintego's
  in-flow bar was dropped because it pushes the page down.
- Pinned extensions: placement is the switch. Only the unbroken run of extensions beside the hamburger hides behind
  the hamburger hover; anywhere else (nav-bar, or before the tabs) they always show. Firefox's own tools never hide
  (they have the overflow). Intended; don't "fix" it. The before-the-tabs trap was fixed upstream in FoxOne 3.9.4
  (#62, our fix, accepted as #63), which also fixed the Customize overrun (#32).
- Download button is not pinned. The overflow chevron stays where Firefox puts it.
- Long term: condense the six files. Pull upstream, patch it, output something leaner.
  Every feature must be switchable on its own (needed for "stock-plus" mode and
  for testing each feature off). Upstream can take or leave any of it.

## Testing setup

- Nightly test profile (fresh, Nova on by default) and a "good" Nightly profile.
- Fully restart Firefox after CSS changes; `about:support` has "Clear startup cache".
- Browser Toolbox: `devtools.chrome.enabled` + `devtools.debugger.remote-enabled`,
  then Ctrl+Alt+Shift+I.
- Laptop is NVIDIA Optimus. Mica flicker has been driver trouble before; rule that
  out before blaming CSS.

## Public repo

This repo is public. Keep personal details (real name, location, health, anything
from ABOUT-ME.md) out of every file here, including notes and issue text.

## End of a session

Before closing a chat, update "Where things stand" and `TODO.md`, then commit in
GitHub Desktop **and click Push origin** (top bar). Commit alone only saves locally.
A new chat should be able to pick up from these files alone.
