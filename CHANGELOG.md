# Changelog

This file covers the version in progress. When a release is cut, the highlights go into the GitHub release notes and
this file is cleared for the next version. Older versions live in their GitHub releases.

The settings and each flavour are documented in [docs/](https://github.com/snkiz/FoxMica/tree/main/docs) on GitHub. The folder is left out of the release zip.

## 1.0, built on FoxOne 4.0

### Fixed

- **ESR 153: the URL bar widens while you type again** ([#37](https://github.com/snkiz/FoxMica/issues/37)). FoxOne 4.0
  took our fix ([FoxOne #69](https://github.com/Firnschnee/FoxOne/issues/69)), so `patches/userChrome/49-esr153-urlbar-widen.patch` is gone.
- **ESR 153: the selected tab's text is no longer accent-coloured** ([#38](https://github.com/snkiz/FoxMica/issues/38)).
  `foxmica-tabs.css` now also sets `--tab-selected-textcolor` on the selected tab, the name older Firefox reads.
- **StockMica+: the extension drawer works in PWAsForFirefox windows** ([#41](https://github.com/snkiz/FoxMica/issues/41)).
  It no longer needs the puzzle pinned (`--uc-extensions-button-right: 1`); leave it at `0`. The drawer is now the run of
  extension icons touching the puzzle button, in the nav bar or in the title bar, wherever the puzzle sits.

### Changed

- **New setting `--ut-drawer-side` (`left` or `right`, default `left`; in `micaplus-config.css`).** It picks which side of
  the puzzle button the drawer picks icons up from and opens on. Only that side is read, so it never opens both ways.
  Point it toward the inside of the bar: `left` when the puzzle is at the right end, `right` when it is at the left end.
  `patches/userChrome/48-unpinned-puzzle-drawer.css` now holds the whole drawer.
- **Built on FoxOne 4.0** ("Back on ESR"). The bookmarks bar reveals only while the pointer rests on the URL text, not on
  the shield or star beside it, and waits 150ms before hiding. The find bar now moves down only while the bookmarks bar
  is revealed, FoxOne's own way ([FoxOne #70](https://github.com/Firnschnee/FoxOne/issues/70)), so FoxMica's static offset is gone: `44-findbar.css` just sets
  `--uc-bookmarks-bar-height` to FoxMica's own bar height. `32-bookmarks-height.css` follows the new reveal trigger.
- **StockMica+: the URL field has more room above and below it.** New setting `--ut-urlbar-padding` (default: follows
  `--ut-bar-padding`, 2px; `micaplus-config.css` sets 4px). It only affects the field, not the tabs.
- **Vertical tabs: the tab list is no longer forced to one bar height by `foxmica-tabs.css`** (a first step for
  [#42](https://github.com/snkiz/FoxMica/issues/42); the tab styling for vertical is still to do).
- **The bookmarks bar waits a little longer before hiding.** `patches/userChrome/42-delays.css` now adds 100ms to
  `--ut-hide-delay` for the bookmarks bar (150ms by default). 50ms was sometimes too short to reach the bar and it
  flickered. FoxOne 3.9.10 made the same change. The nav buttons still use `--ut-hide-delay` alone.

### Docs

- `docs/stockmica-plus.md`: the PWAsForFirefox note and the drawer lines follow the new behaviour; the new setting is in the table.
- README: the ESR 153 selected-tab-text known issue now links its own issue ([#38](https://github.com/snkiz/FoxMica/issues/38)).
- `TODO.md` and `CLAUDE.md` brought up to date (0.9.1, StockMica+, closed issues).
- The built files' header says 0.9.1 (it still said 0.9).
- The README is now short: the three modes with a picture slot each, what is new, install, and the main known issues. The longer pages (FoxOne-Mica with its settings, StockMica+, OEM tabs) moved to `docs/`, and `scripts/README.md` is now the "Building from source" page.
