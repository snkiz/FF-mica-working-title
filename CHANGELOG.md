# Changelog

This file covers the version in progress. When a release is cut, the highlights go into the GitHub release notes and
this file is cleared for the next version. Older versions live in their GitHub releases.

The settings and each flavour are documented in [docs/](https://github.com/snkiz/FoxMica/tree/main/docs) on GitHub. The folder is left out of the release zip.

## 0.9.2 "Take your extensions with you", built on FoxOne 3.9.10

### Fixed

- **ESR 153: the URL bar widens while you type again** ([#37](https://github.com/snkiz/FoxMica/issues/37)).
  `patches/userChrome/49-esr153-urlbar-widen.patch` makes FoxOne's two widening rules match `#urlbar[open]` as well as
  `.urlbarView:popover-open`, which doesn't exist before Firefox 157. A new tab still stays narrow until you click.
- **ESR 153: the selected tab's text is no longer accent-coloured** ([#38](https://github.com/snkiz/FoxMica/issues/38)).
  `foxmica-tabs.css` now also sets `--tab-selected-textcolor` on the selected tab, the name older Firefox reads.
- **StockMica+: the extension drawer works in PWAsForFirefox windows** ([#41](https://github.com/snkiz/FoxMica/issues/41)).
  It no longer needs the puzzle pinned (`--uc-extensions-button-right: 1`); leave it at `0`. The drawer is now the run of
  extension icons touching the puzzle button, in the nav bar or in the title bar, wherever the puzzle sits.

### Changed

- **New setting `--ut-drawer-side` (`left` or `right`, default `left`; in `micaplus-config.css`).** It picks which side of
  the puzzle button the drawer picks icons up from and opens on. Only that side is read, so it never opens both ways and
  the puzzle no longer moves. In a PWA window the icons land after the puzzle, so set `right` there.
  `patches/userChrome/48-unpinned-puzzle-drawer.css` now holds the whole drawer.
- **Built on FoxOne 3.9.10** ("Aim for the text"). The bookmarks bar reveals only while the pointer rests on the URL text,
  not on the shield or star beside it. `10-strip-config.patch` follows the new hide-delay default (150ms).
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
