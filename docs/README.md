[Back to the README](../README.md)

# Settings
---
FoxMica is picked and set up in `userChrome.css`, the file Firefox reads from your `chrome` folder. It does two jobs: it loads the other files in order, and it holds a couple of optional blocks. Every flavour has its own page:

| Flavour | Page | Settings live in | Files in `chrome` |
| --- | --- | --- | --- |
| FoxOne-Mica (default) | [FoxOne-Mica](foxone-mica.md) | `foxmica-config.css` | `userChrome.css`, `foxone-mica.css`, `foxmica-config.css`, `foxmica-tabs.css`, `userContent.css` |
| StockMica+ | [StockMica+](stockmica-plus.md) | `micaplus-config.css` (it loads `foxmica-config.css` first) | the five above, plus `micaplus-config.css` |
| OEM drop-in replacement tabs | [OEM tabs](oem-tabs.md) | an optional block in `userChrome.css` | `userChrome.css`, `foxmica-tabs.css` |

## How the loader works

`userChrome.css` starts with the `@import` lines, and the comment above them explains the modes. Only some lines are active at one time:

    @import url("foxone-mica.css") screen;
    @import url("foxmica-config.css") screen;
    /* @import url("micaplus-config.css") screen; */
    @import url("foxmica-tabs.css") screen;

A line is active unless it sits inside a comment. `@import` lines have to come first in the file, and later ones win ties, so keep them in this order.

- **FoxOne-Mica:** leave it as it is.
- **StockMica+:** comment out the `foxmica-config.css` line and uncomment the `micaplus-config.css` one. Use one of the two, not both.
- **OEM drop-in replacement tabs:** comment out every line above `foxmica-tabs.css`.

Firefox only rereads `userChrome.css` when it starts, so restart after a change. If you edit the file, keep a copy: a newer release will overwrite it.

`foxmica-config.css` has to stay in `chrome` in every mode that uses `userContent.css`, because `userContent.css` imports it.

## Optional blocks in userChrome.css

Both blocks are switched off by default. To use one, delete its first line (the one starting with `OFF-START`) and its last line (the one ending with `OFF-END`), then change the values you want.

**Tab settings (for OEM drop-in replacement tabs).** The other flavours keep these in their own config. Every value shown is already the default.

| Setting | What it does |
| --- | --- |
| `--ut-tab-radius` | How round the top corners of a tab are. |
| `--ut-tab-pinstripe` | Thin edge around the selected tab: `1` shows it (the default here), `0` hides it. |
| `--ut-tab-weight` | How bold the tab titles are (400 normal, 700 bold). |
| `--ut-tab-text` | Tab title colour. Not set by default, so it follows the toolbar text. |
| `--ut-puzzle-color` | Colour of the puzzle button. Just flare. `AccentColor` is the default; `currentColor` gives Firefox's plain look. |

**Your own UI font.** `userChrome.css` contains a switched-off block that sets a font for the browser interface. The instructions are in the comment above it. It only affects the browser UI; the about: pages are separate documents.
