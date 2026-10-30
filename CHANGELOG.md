# Changelog

This file covers the version in progress. When a release is cut, the highlights go into the GitHub release notes and
this file is cleared for the next version. Older versions live in their GitHub releases.

The settings and each flavour are documented in [docs/](https://github.com/snkiz/FoxMica/tree/main/docs) on GitHub. The folder is left out of the release zip.

## Next release, built on FoxOne 4.0.2 plus unreleased FoxOne changes (pre-release copy, replace with the release before tagging)

### Fixed

- **Vertical tabs no longer get the horizontal tab shape** ([#42](https://github.com/snkiz/FoxMica/issues/42)).
  `foxmica-tabs.css` (the OEM drop-in tabs) now leaves the vertical list to Firefox: its pill when extended, its circle
  when collapsed. In FoxMica's own modes the selected vertical tab is a filled rounded rectangle (`--ut-layer` fill,
  `--ut-tab-radius` on all four corners, the pinstripe all the way round if it is on), inset 10px from the strip's
  sides, the same on a left or a right sidebar. Before, it had top-only corners, a flat bottom and separators, and
  every tab after the first sat off-centre. `patches/userChrome/39-vertical-tabs.css`.

- **The URL bar keeps its click area at larger densities** ([#34](https://github.com/snkiz/FoxMica/issues/34)). The
  URL bar now has room for the worst case, the largest density, so the same size works at every density. The default
  URL bar and tab widths were retuned to match (`foxmica-config.css`, `micaplus-config.css`).

- **The tab loading bar is the accent colour again.** The ESR 153 tab text fix (#38) had turned it text-coloured on
  every version. Only the bar along the bottom of a loading tab is drawn now; FoxOne's glow along the top edge is
  hidden. `patches/userChrome/36-small-fixes.css`.

- **The floating bookmarks bar no longer covers the sidebar launcher on ESR 153, and follows the density.** The launcher
  is wider on ESR 153 than on newer Firefox, and the widths change with the density. On newer Firefox the bar works out
  how far to step aside from the sizes Firefox builds the launcher from (the button size, the padding, the collapsed
  tab width), the same sum Firefox does, so it follows the density. On ESR 153 the horizontal width is a fixed measured
  value (50.47px at the default text size, the width of the launcher you see; Firefox's own variable reads 2px more),
  and the vertical width is the collapsed tab width less 1px. The old sidebar is recognised by the pref
  `sidebar.revamp.round-content-area`, which newer Firefox dropped. `--ut-sidebar-strip` and
  `--ut-sidebar-strip-vertical` are no longer set in `foxmica-config.css` (commented examples instead, in the
  advanced section and marked as a last resort); set a number only to override it, and a fixed number does not follow
  the density.
  With vertical tabs and the sidebar set to always show, a strip collapsed to icons now lets the bar step aside too,
  instead of hiding it; an expanded strip still hides the bar, since its width is wherever it was dragged.
  `patches/userChrome/34-bookmarks-sidebar.css`.

- **A sidebar panel no longer slides under the launcher with "expand on hover".** With a panel open (History, Settings),
  Firefox keeps a margin the width of the collapsed launcher on the panel, so it sits beside the launcher. FoxOne's
  `.chrome-block { margin-inline: 0 !important }` cancels that margin, because the panel carries the `chrome-block`
  class, so the panel went under the launcher. This is a FoxOne bug, not a FoxMica one; the patch puts Firefox's own
  margins back for both sidebar sides, and can go once FoxOne fixes it. Tested on ESR 153 with "browser.nova.enabled" on and off, and with the sidebar on
  either side. `patches/userChrome/37-launcher-flyout.css`.
- **The in-flow bookmarks bar (`--ut-bookmarks-inflow: 1`) no longer grows when you hover the toolbar**
  ([#44](https://github.com/snkiz/FoxMica/issues/44)). It opened on any hover over the whole toolbar, at FoxOne's `4em`
  plus 6px padding. It now follows the floating bar's rules: it opens when the pointer rests on the URL text, on the
  bookmark star, on the bar, on an open folder or its right-click menu, or on a fresh tab, and grows to
  `--ut-bookmarks-height` with no extra padding. Collapsed, it is 0px instead of 2px, which removes the thin strip that
  showed on about pages. The sidebar is still pushed down by the open bar in this mode; it sits outside the toolbox, so
  that stays. `patches/userChrome/28-bookmarks-bar.css`.

- **The bookmark star opens the floating bookmarks bar too.** FoxOne only reacts to the URL text, a small target on a
  short URL bar. Same hover delay as the text. `patches/userChrome/32-bookmarks-height.css`.

- **Text on primary buttons in popups uses the puzzle colour.** FoxOne now pins that text to the palette base, which is
  near black. FoxMica uses `--ut-puzzle-color` (the palette's hover colour by default) for a softer look. This is a
  stopgap: it doesn't pass the contrast ratio on every palette, the light one especially. The proper fix is to calculate
  the text colour from the accent. `patches/userChrome/36-small-fixes.css`.

### Docs

- README: the tested-on note now says Nightly and ESR 153 are the ones tested properly, and the other channels get a
  look when a change touches them. Requirements no longer reads as Nightly only. The vertical tabs known issue says
  "Good Enough" ([#31](https://github.com/snkiz/FoxMica/issues/31)), and a few typos are fixed.
