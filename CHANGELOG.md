# Changelog

This file covers the version in progress. When a release is cut, the highlights go into the GitHub release notes and
this file is cleared for the next version. Older versions live in their GitHub releases.

The settings and each flavour are documented in [docs/](https://github.com/snkiz/FoxMica/tree/main/docs) on GitHub. The folder is left out of the release zip.

## Next release, built on FoxOne 4.0.2

### Fixed

- **Vertical tabs no longer get the horizontal tab shape** ([#42](https://github.com/snkiz/FoxMica/issues/42)).
  `foxmica-tabs.css` (the OEM drop-in tabs) now leaves the vertical list to Firefox: its pill when extended, its circle
  when collapsed. In FoxMica's own modes the selected vertical tab is a filled rounded rectangle (`--ut-layer` fill,
  `--ut-tab-radius` on all four corners, the pinstripe all the way round if it is on), inset 10px from the strip's
  sides, the same on a left or a right sidebar. Before, it had top-only corners, a flat bottom and separators, and
  every tab after the first sat off-centre. `patches/userChrome/39-vertical-tabs.css`.

### Docs

- README: the tested-on note now says Nightly and ESR 153 are the ones tested properly, and the other channels get a
  look when a change touches them. Requirements no longer reads as Nightly only. The vertical tabs known issue says
  "Good Enough" ([#31](https://github.com/snkiz/FoxMica/issues/31)), and a few typos are fixed.
