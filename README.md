# FoxMica

A Firefox theme for Windows 11: the real Mica backdrop behind a one-line browser UI (tabs and URL bar in one row), with Explorer-style tabs. Built on [FoxOne](https://github.com/Firnschnee/FoxOne) by Firnschnee.

> **Work in progress.** Tested only on Firefox Nightly 160 on Windows 11, with the Nova redesign on (the default) and off. Other versions have not been tried yet.

![FoxMica on Firefox Nightly, Windows 11](assets/Screenshot-main.png)

## What you get

- **One-line layout** from FoxOne: tabs, URL bar and buttons share one row.
- **Mica** behind the tab strip and URL bar, the genuine Windows backdrop.
- **Two layers, like Explorer.** The top row is the plain Mica "strip". The selected tab, the bookmarks bar and the sidebar sit on a lighter "layer" above it.
- **Explorer-style tabs:** rounded top corners, flat inactive tabs, a filled selected tab, thin separators.
- **Bar height follows Firefox's UI density** (compact, normal, touch).
- **Quiet nav buttons.** Back, Forward and Reload reveal when you hover the bar, after a short delay so a quick pass
  doesn't shift the URL field. Click into the URL text and they give way again.
- **Quiet URL-bar icons.** They hide on the edges: permissions under the shield on the left, content actions (Reader,
  translate and so on) under the star on the right. The URL field grows from the middle when you hover either.
- **Pinned extensions tuck behind the hamburger** and reveal when you hover it. This has no off switch, by design
  (see Limitations below).
- **One settings file**, `foxmica-config.css`, shared by the browser UI and the about: pages and new tab, so the two can't drift apart.
- **Nothing forced.** No `user.js`, no preference changes, no toolbar layout changes. You set the prefs below yourself.

## Requirements

- Windows 11. Mica does not exist on other systems.
- Firefox Nightly 160, see the note above.
- Transparency effects on: Windows Settings -> Personalization -> Colors.

## Install

1. Close Firefox completely.
2. Open your profile folder (`about:support`, the Profile Folder row).
3. Create a folder named `chrome` there if it doesn't exist.
4. Copy these **five files** into `chrome`. They load each other by name, so all five must be there:
   - `userChrome.css`
   - `foxone-mica.css`
   - `foxmica-config.css`
   - `foxmica-tabs.css`
   - `userContent.css`
5. Set the prefs below in `about:config`.
6. Start Firefox.

## about:config prefs

| Pref | Value | Why |
| --- | --- | --- |
| `toolkit.legacyUserProfileCustomizations.stylesheets` | `true` | Needed. Without it Firefox ignores everything in `chrome`. |
| `widget.windows.mica` | `true` | Needed. Turns on the Mica backdrop. |
| `widget.windows.mica.toplevel-backdrop` | `2` or `4` | Optional. `2` = Mica, `4` = Mica Alt. |
| `browser.tabs.allow_transparent_browser` | `true` | Optional. Lets blank tabs show Mica too. Flaky on laptops with a discrete GPU. |
| `browser.display.background_color` (and `.dark`) | `transparent` | Optional. Goes with the pref above. |
| `browser.compactmode.show` | `true` | Optional. Shows the Compact option under Customize -> Density. |

The dynamic bookmarks bar may also need the bookmarks toolbar set to "Always Show". Other FoxOne-style themes say so; I haven't confirmed it for this one yet.

## Settings

Everything you are meant to change is in `foxmica-config.css`. It is variables only. The file's own comments explain each one; this is the short version.

| Setting | What it does |
| --- | --- |
| `--uc-color-base`, `-surface`, `-accent`, `-text`, `-hover` | The palette (dark). The `--uc-light-*` set is used when Firefox runs light. |
| `--uc-rounded`, `--uc-border-radius` | Rounded corners on or off, and how round. |
| `--ut-bar-height-compact / -normal / -touch` | Height of the one-line bar for each Firefox UI density. |
| `--ut-bar-padding` | Space above and below the tabs and URL field inside the bar. |
| `--ut-btn-inner-*`, `--ut-btn-outer` | Toolbar button padding, which sets how far apart the icons sit. |
| `--ut-tab-radius`, `--ut-tab-top-gap`, `--ut-tab-weight` | Tab corner radius, gap above tabs, font weight. |
| `--ut-layer` | The colour and see-through-ness of the layer (selected tab, bookmarks bar, sidebar). Lighter grey or lower alpha = lighter tab. |
| `--ut-puzzle-color` | Colour of the extensions (puzzle) button icon. |
| `--ut-bookmarks-inflow` | The bookmarks bar floats over the page (`0`) or sits in the page flow (`1`). |
| `--ut-drag-left` | Window-drag area left of the sidebar button when not maximized. `0` removes it. |
| `--ut-hide-trust-label` | Hide the text next to the site-info icon ("Not secure"). Default: hidden. |
| `--ut-hide-pip-button` | Hide the picture-in-picture button in the URL bar (the video has its own). Default: hidden. |
| `--ut-hide-disabled-nav` | Hide the Forward button alone while it has nowhere to go (`0` off, `1` on). FoxOne's own `--uc-hide-disabled-nav-buttons` hides Back as well. |
| `--uc-autohide-nav-buttons` | FoxOne's nav reveal: `0` always show, `1` hover and focus, `2` hover only. Mode `2` also gives click-to-cancel. |
| `--ut-hover-delay` | How long you hover before the nav buttons and the bookmarks bar reveal. |
| `--ut-hide-delay` | How long they wait before hiding again. |
| `--ut-findbar-left` | Put the floating find bar on the left (`1`) instead of the right (`0`). |
| `--uc-status-panel-spacing` | Gap from the window edge for the status text and the floating find bar (`0` = corner). |

A few more values are not in the config because they follow from the ones above: `--ut-strip` (a tint for the top row, plain Mica by default), `--ut-tab-hover-bg`, `--ut-separator`, `--ut-bookmarks-bg` and `--ut-bookmarks-height`. They sit in the "LAYER VALUES" block in `patches/userChrome/20-layer-values.css`. Change one there, then run `node scripts/assemble.mjs` (see "Building from source" below), because `foxone-mica.css` is a built file.

Further down the file are FoxOne's own settings with the values chosen here (URL bar width, tab widths, and so on). FoxOne's [customisation guide](https://firnschnee.github.io/FoxOne/customisation.html) documents those.

## Your own UI font (optional)

`userChrome.css` contains a switched-off block that sets a font for the browser interface. The instructions are in the comment above it. It only affects the browser UI; the about: pages are separate documents.

## Limitations and quirks

- There is almost no usable toolbar on the right: one tool, maybe two. The extension hover pushes them over, and
  things are cramped in Customize mode.
- The hamburger hover-reveal has no off switch, by design. The right corner is a shockingly cramped area, held
  together with hopes and dreams.
- Pinned extensions land at the end of the toolbar, which is now next to the URL bar, and behave normally. Move one
  into the stack beside the hamburger and it is inside the hover zone, so the hamburger eats it until you hover.
- Customize mode does strange things to the bar, in stock Firefox too (the new-tab button pins to the end of the tab
  bar and a large gap shows on the left). It's not real, it can't hurt you.

## Tips

- Short on toolbar? Nothing stops you putting things in the bookmarks bar. ;)
- Spacing is finicky. `--uc-hamburger-width` (30px) sets how far out the extensions flyout sits, and 30px fits the
  puzzle. `--uc-extensions-button-width` (32px) is the puzzle's spacing, 30px will not fit if you change it.
  `--uc-toolbar-button-width` and `--uc-newtab-width` (26px) are the generic icon spacing.

## Known issues

- Customize mode: pinned extensions overrun the hamburger and puzzle ([#32](https://github.com/snkiz/FoxMica/issues/32)).
- Vertical tabs are untested ([#31](https://github.com/snkiz/FoxMica/issues/31)).

- The floating bookmarks bar only reveals when the pointer is over the URL bar, not the whole top row. That is how FoxOne works.
- Hovering Mica areas sometimes flickered during development on a laptop with NVIDIA and integrated graphics. It went away after reboots and driver updates, so it is probably a driver problem, but this isn't proven.
- Not tested yet: turning each feature off to check the theme degrades cleanly, other Firefox versions, and non-Windows systems. Vertical mode has not been worked on as yet.

## Building from source

You don't need this to use the theme: the five files above are all that goes in your profile. This is for changing
FoxMica itself.

`foxone-mica.css` and `userContent.css` are **built files**. They start with a header saying so; don't edit them by hand.
FoxOne's own files sit untouched in `vendor/`, every FoxMica change to them is a small file in `patches/`, and
`scripts/` (Node, nothing to install) puts them together:

- `node scripts/assemble.mjs` rebuilds both files from `vendor/` and `patches/`.
- `node scripts/check.mjs` checks that `vendor/` is the real FoxOne release, that every patch still applies, and that
  the built files are up to date. Add `--offline` to skip the download.
- `node scripts/pull-foxone.mjs <tag>` fetches a new FoxOne release into `vendor/`.

The patch format and the rest are in [scripts/README.md](scripts/README.md).

## Contributing

Bug reports and ideas are welcome: please open an issue.
Want to send a pull request? Open an issue first and state your case.
I'll ask for the PR if it fits. This is a hobby project and I review
everything by hand, so unrequested PRs may sit or be closed.

Testers wanted: FoxMica has only been tried on one screen. Screenshots from other screen sizes and
Windows scale settings are very welcome, see [#23](https://github.com/snkiz/FoxMica/issues/23).

## Credits

- [FoxOne](https://github.com/Firnschnee/FoxOne) by Firnschnee (MIT). `foxone-mica.css` and `userContent.css` are built from FoxOne 3.9.7, kept exactly as released in `vendor/`, plus FoxMica's changes in `patches/`. FoxOne in turn credits [LittleFox](https://github.com/biglavis/LittleFox) and [Cascade](https://github.com/andreasgrafen/cascade).
- The Mica rules in `patches/userChrome/22-mica.css` are derived from [Wintego's Firefox-transparent-theme](https://github.com/Wintego/Firefox-transparent-theme).
- The look was matched by eye against Windows 11 Explorer and the MicaBar theme of Windhawk's [Windows 11 File Explorer Styler](https://windhawk.net/mods/windows-11-file-explorer-styler) mod (Windhawk is by [m417z](https://github.com/m417z)). No code from that project was used.
- [@C-O-D](https://github.com/C-O-D) for the catch that put the finishing polish on the URL-bar icons ([FoxOne#59](https://github.com/Firnschnee/FoxOne/issues/59)). First outsider.
- Tab style: written by snkiz, with help from Claude (Anthropic).

## License

MIT, the same as FoxOne. See [LICENSE](LICENSE), which keeps FoxOne's copyright notice.
