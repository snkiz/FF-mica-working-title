# Changelog

This file covers the version in progress. When a release is cut, the highlights go into the GitHub release notes and
this file is cleared for the next version. Older versions live in their GitHub releases.

## 0.9.1 (2026-10-21), built on FoxOne 3.9.9

Mode 2 is rebuilt: it is now the full theme with Firefox's own two-row layout, set by a config file. The extension
drawer follows the puzzle button when it is unpinned, and the find bar no longer hides behind the bookmarks bar.

### Added

- **Mode 2 is now StockMica+: `micaplus-config.css`.** Firefox's own layout with FoxMica's look: tabs on top, the
  nav bar below, the burger and the puzzle button in the nav bar. It is the full theme (`foxone-mica.css`) with a
  second config loaded instead of `foxmica-config.css`. That config starts by loading `foxmica-config.css`, so the
  palette, Mica, layers, shapes, delays and everything else are the same, and it overrides only what differs: the
  one-line bar off, the puzzle unpinned, the navigation buttons always shown, wider tabs, the puzzle colour. Pick the
  one you want in `userChrome.css`. `foxmica-plus.css` is gone.
- **`--ut-one-line`** switches FoxOne's one-line bar off when it is 0 (`patches/userChrome/46-stock-tabs.css`). Unset
  it is on, as before. With it off: the rows are back in Firefox's order, the burger and puzzle are in the nav bar's
  flow and nothing is reserved for them, the nav bar takes the selected tab's fill, the URL field is a lighter, fully
  rounded field like Explorer's address bar (`--ut-urlbar-fill` and `--ut-urlbar-fill-focus` tune it), and the grab
  area on the left is on the tab bar.
- **The extension drawer follows an unpinned puzzle** (`48-unpinned-puzzle-drawer.css`). With
  `--uc-extensions-button-right: 0`, the unbroken run of extension icons touching the puzzle on its left tucks away
  and slides out when you rest on the puzzle, on one of the icons, or while an extension popup is open. Anything that
  is not an extension icon ends the run, and what lies after the puzzle toward the corner does not matter.
- **Title-bar icons only hide while the puzzle is pinned** (`47-title-bar-hide-only-when-pinned.patch`). Unpinned, they
  always show, so there is one drawer, the one beside the puzzle, and not two opened from places you can't both reach.
- **Puzzle button colour in every mode.** The rule moved to `foxmica-tabs.css`, so it applies in tabs only too.
  `--ut-puzzle-color` sets it (`AccentColor` unless a config says otherwise; `currentColor` gives Firefox's plain
  look). It is listed in the optional settings block for tabs only in `userChrome.css`, now five settings.
- **PWA windows (PWAsForFirefox):** the nav bar no longer stays open and empty under the tabs while the page is in
  scope. The fixed bar height was beating the addon's own `min-height: 0`.

### Changed

- **FoxOne updated from 3.9.7 to 3.9.9**
  ([3.9.8, "Wait until you type"](https://github.com/Firnschnee/FoxOne/releases#release-3.9.8) and
  [3.9.9, "Frames, not blocks"](https://github.com/Firnschnee/FoxOne/releases#release-3.9.9)). The URL bar widens only
  while its results are open, not on focus alone, so a new tab no longer shifts the tabs until you type
  ([#68](https://github.com/Firnschnee/FoxOne/issues/68), suggested by nickj2014). Sidebar rows (history, synced tabs),
  their headers and the bookmarks sidebar get an amber frame on hover instead of a filled block. Toolbar extension
  buttons show a ring on hover (light yellow) and in amber while the popup is open; in the nav bar they gave no
  hover feedback before. The sidebar launcher marks the open panel in amber. Also in the code, and not in Firn's
  notes: the sidebar and Library fields take the corner radius setting.
- **The find bar starts below the floating bookmarks bar**, so the bar can't cover it (`44-findbar.css`). It applies
  while the bookmarks bar floats. The gap stays when the bar is hidden.
- **The pinstripe default depends on the mode.** Off in the full theme and StockMica+ (`--ut-tab-pinstripe: 0` in
  `foxmica-config.css`), on in tabs only, where it looks like Nova's own tabs.
- **The loader instructions in `userChrome.css`** are rewritten for the three modes and the two configs.

### Docs

- `userChrome.css`: new mode descriptions (StockMica+, tabs only as "OEM drop-in replacement tabs").
- `foxmica-config.css`: typos fixed in the all-tabs button and tab minimum width comments.

### Known issues

- StockMica+: the drawer opens to the left of the puzzle only (no left/right switch yet), and icons on its right
  stay visible. In a PWA window the puzzle is in the title bar, so set `--uc-extensions-button-right: 1` there.
- Firefox ESR 153: the selected tab's text shows the dark accent colour instead of white. Firefox 160 is fine
  ([#22](https://github.com/snkiz/FoxMica/issues/22)).
- Firefox ESR 153 does not have Nova switched on by default. FoxMica is built for Nova, and the older Proton look is
  not supported, so on 153 Nova has to be switched on first.
