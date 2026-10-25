# Changelog

This file covers the version in progress. When a release is cut, the highlights go into the GitHub release notes and
this file is cleared for the next version. Older versions live in their GitHub releases.

The settings and each flavour are documented in [docs/](https://github.com/snkiz/FoxMica/tree/main/docs) on GitHub. The folder is left out of the release zip.

## Unreleased (after 0.9.1), built on FoxOne 3.9.9

### Changed

- **The bookmarks bar waits a little longer before hiding.** `patches/userChrome/42-delays.css` now adds 100ms to
  `--ut-hide-delay` for the bookmarks bar (150ms by default). 50ms was sometimes too short to reach the bar and it
  flickered. FoxOne 3.9.10 made the same change. The nav buttons still use `--ut-hide-delay` alone.

### Docs

- README: the ESR 153 selected-tab-text known issue now links its own issue ([#38](https://github.com/snkiz/FoxMica/issues/38)).
- `TODO.md` and `CLAUDE.md` brought up to date (0.9.1, StockMica+, closed issues).
- The built files' header says 0.9.1 (it still said 0.9).
- The README is now short: the three modes with a picture slot each, what is new, install, and the main known issues. The longer pages (FoxOne-Mica with its settings, StockMica+, OEM tabs) moved to `docs/`, and `scripts/README.md` is now the "Building from source" page.
