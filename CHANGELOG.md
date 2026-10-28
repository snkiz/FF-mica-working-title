# Changelog

This file covers the version in progress. When a release is cut, the highlights go into the GitHub release notes and
this file is cleared for the next version. Older versions live in their GitHub releases.

The settings and each flavour are documented in [docs/](https://github.com/snkiz/FoxMica/tree/main/docs) on GitHub. The folder is left out of the release zip.

## 1.0.2 "Paper Cuts", built on FoxOne 4.0.2

### Fixed

- **The bookmarks bar no longer grows when you right-click a bookmark.** FoxOne 4.0.1 brought this out. While the
  right-click menu is under the pointer, the bar now stays revealed at its own height (unless one of the toolbar
  menus is open). `patches/userChrome/32-bookmarks-height.css`.
- **The sidebar launcher's flyout follows the palette.** With vertical tabs and the sidebar on "expand on hover", the
  expanded launcher is now the palette's base colour. Before, it showed Firefox's violet and orange gradient on newer
  Firefox, and under Mica on ESR 153 it had no background at all. A dynamic theme keeps its own colours.
  `patches/userChrome/37-launcher-flyout.css`.

### New

- **The floating bookmarks bar steps aside for the sidebar launcher** (floating bar only, `--ut-bookmarks-inflow: 0`).
  With horizontal tabs the bar starts after the launcher strip, on whichever side the sidebar sits. With vertical tabs
  and "expand on hover" it starts after the vertical strip, and hides while the flyout is open. With vertical tabs and
  any other sidebar setting, and whenever a sidebar panel is open, the bar hides, as there is no room for it. The
  offsets are fixed numbers, not live: if you resize the vertical strip wider, the bar does not follow.
  `patches/userChrome/34-bookmarks-sidebar.css`.
- **New settings `--ut-sidebar-strip` (default 36px) and `--ut-sidebar-strip-vertical` (default 48px)**, in
  `foxmica-config.css`. They are the widths the bar steps aside by. Change them if your launcher strip is a different
  width.

### Changed

- **Built on FoxOne 4.0.2** (4.0.1 and 4.0.2 are small). Every FoxMica patch still applies.

### Developer

- `scripts/check.mjs` now also checks that every CSS file (and the built files) has matching `{` and `}`, and says
  which line is unmatched.

### Docs

- `docs/foxone-mica.md`: the two new settings are in the table.
