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

- **The tab loading bar is the accent colour again.** The ESR 153 tab text fix (#38) had turned it text-coloured on
  every version. Only the bar along the bottom of a loading tab is drawn now; FoxOne's glow along the top edge is
  hidden. `patches/userChrome/36-small-fixes.css`.

- **ESR 153: the floating bookmarks bar no longer covers the sidebar launcher.** The launcher is wider on ESR 153 (49px
  with horizontal tabs, 43px with vertical tabs on "expand on hover") than on newer Firefox. The bar now steps aside by
  49px and 43px there, and by 36px and 48px elsewhere; the old sidebar is recognised by the pref
  `sidebar.revamp.round-content-area`, which newer Firefox dropped. `--ut-sidebar-strip` and
  `--ut-sidebar-strip-vertical` are no longer set in `foxmica-config.css` (commented examples instead), so those
  defaults apply; set a number to override. `patches/userChrome/34-bookmarks-sidebar.css`.

- **The in-flow bookmarks bar (`--ut-bookmarks-inflow: 1`) no longer grows when you hover the toolbar** ([#44](https://github.com/snkiz/FoxMica/issues/44)). It opened on
  any hover over the whole toolbar, at FoxOne's `4em` plus 6px padding. It now follows the floating bar's rules: it
  opens when the pointer rests on the URL text, on the bar, on an open folder or its right-click menu, or on a fresh
  tab, and grows to `--ut-bookmarks-height` with no extra padding. `patches/userChrome/28-bookmarks-bar.css`.

### Docs

- README: the tested-on note now says Nightly and ESR 153 are the ones tested properly, and the other channels get a
  look when a change touches them. Requirements no longer reads as Nightly only. The vertical tabs known issue says
  "Good Enough" ([#31](https://github.com/snkiz/FoxMica/issues/31)), and a few typos are fixed.
