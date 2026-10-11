# TODO

Items marked [#n] are GitHub issues on snkiz/FoxMica; the issue holds the details.

Numbers are kept stable so old chats still make sense. Don't renumber.
Gathered from the three setup chats on 2026-10-04. The maintainer's own notes beat this list
where they disagree.

## Now

- **24. Modal dialogs: background is back but black** [#4] (Nova on). Fixed the missing
  background 2026-10-04 by scoping section 1 of userChrome-foxone-overrides.css to
  `#main-window` (it had made every chrome document transparent, dialogs included).
  Left to do: dialogs should use the theme palette, not black. Readable for now.
  Item 22 (the "make Firefox your default browser" bar) is the same dialog, so it gets fixed with this one.
- **29. Bookmarks bar vs sidebar mismatch.** [#5] The sidebar is now properly translucent;
  the floating bookmarks bar is still solid, so it looks half on, half off. Ties in
  with item 1. Test against a busy wallpaper (a brick pattern works well).

## Next time

- **Check section 4 of the overrides (bar height).** FoxOne 3.9.1 has `--uc-row-height` (FoxOne #57), which follows
  Firefox's density, so some of what section 4 pins may no longer be needed. Firn notes vertical tabs change
  `--tabstrip-min-height`.
- **userContent.css is still FoxOne 3.8.7's** (with our edits). Compare it with 3.9.1's and carry over anything new.
- **Click-to-cancel on the nav reveal (optional, FoxMica-only).** Clicking into the URL text cancels a pending nav
  reveal. We had it as an experiment on the old 59 branches and liked it; Firn took the star hot-area part but not
  this. If wanted, write it fresh as an override against 3.9.1's selectors, not a paste of the old one.

## First bug-fix pass

- 18. Selection contrast on about: pages [#7] (optional separate variable).
- 4. Sidebar button click target [#2] is much bigger than the icon (about half the
  window-grab padding). Did we cause it?
- 2. Sidebar spacer: [#3] stop bookmarks/tools covering the minimized sidebar button.
  Maybe hide it when the sidebar is open.
- 14. Tab loading highlight is white [#12] (keep it or match the palette?).
- 28. [#13] Nova on: one animated built-in theme left the tab bar transparent. Fine with
  Nova off. Only one theme seen so far; check a few others before chasing it.
- 31. [#20] Fix the comment on the static bookmarks bar in foxone-config.css: it says the static bar uses the
  translucent layer, but so far only Customize mode does. (Static on the layer is still the plan.)
- 32. [#19] Try pinning the overflow (>>) button the way --ut-pin-downloads pins Downloads. Might not work out.
- 33. Tab-bar right stop: FoxOne's max-width on #tabbrowser-tabs reserves hamburger + one button + drag space +
  new-tab (about line 1037). We shrank those four in foxone-config.css (lines 170-174). Last time I looked,
  tabs could overrun the buttons with the flexible spacer taken out. Test: remove the spacer, fill the bar
  with tabs, see if they run under the buttons. If so, the reserve is too tight and the spacer hides it.
- 34. Density moved: in Nightly 159 the Customize -> Density switch redirects to about:settings (Appearance).
  Look into what changed (does `browser.compactmode.show` still matter? ESR?), then update README line 48 and
  the comment in foxone-config.css lines 52-54.

## After launch

- **PWAs for Firefox theme** (has a milestone): at least a theme that runs on top of the addon's
  default PWA styling, the way FoxMica runs on FoxOne (done before with the Proton tab tweaks).
  End goal: detect the addon and import the existing user theme, or draw up a solution for their
  side to offer. Forked PWAs for Firefox to read their theme code. Also: the system install is the
  setup that started FoxMica; find a change that makes the original mistake impossible to repeat
  and offer it upstream (they helped last time), issue first. Back up the PWA profiles before testing.
- **Submit to the FirefoxCSS Store** [#30] (https://firefoxcss-store.github.io/submit/). They take a GitHub
  issue (their template): repo URL, short description, screenshots, tags. Their bot opens a PR and
  maintainers review it. Before submitting: more screenshots (more views, not just the main window)
  and a docs pass. Check their issue template for image size and allowed tags. Firn (FoxOne) says it's a form and
  that most of FoxOne's traffic comes from the store, and he approved the idea on #30, so this is worth doing well.
- 8. [#24] Stock-plus mode: turn off the one-line bar but keep the other goodies. Needs
  every feature switchable, and testing each feature off.
- 12. [#22] Backport to ESR 153. Check the Nova pref name there. Test Nova on and off.
- 13. [#27] Tab-drag test against upstream's fix (FoxOne 3.8.5, about line 2746).
- 6, 7, 21. [#25] Theme-aware tint like WinUI (Mica grey tinted by accent/wallpaper),
  theme picker support, inherit Windows system colours. Do these together.
- 30. Palette readability [#8]: pick palette ratios so every text/background pair stays
  readable (4.5:1 for text, 3:1 for icons and large text), whatever colours are
  chosen. Found while drafting 18 (selected text is about 1.8:1). Ties in with 6, 7, 21.
- [#26] Five-colour palette: only the main five colours in the user config, the rest derived and moved
  to an advanced section. Depends on #25 and #8.
- 1. Bookmarks bar on new tab: [#5] drop the background, clear tint with just enough
  contrast for the text.
- 5. [#23] Scaling: "certified good enough", poke at it later.
- 19. [#28] Try `widget.windows.mica.popups` (it's 0 in the good profile's user.js).
- 20. [#29] Check `widget.windows.apply-dwm-resize-hack` with Mica (fullscreen from maximized).
- 23. Maybe hide nav controls [#1] while the URL dropdown is open or the cursor is in it.
- 10. Tab right-click menu: it's far too long. Trim it and reorder it with CSS (hide unused items, move
  Reopen Closed Tab to the top; untested idea: `#context_undoCloseTab { order: -1; }`). Plus a small
  extension for "New Tab to the Left" (no add-on found that does left; extensions can add items but
  not place them at the top).
- [#21] Refactor: condense the files, trim the very long comments, move rarely used
  settings to an advanced section.

## Maybe, probably never

- 9. Fully transparent about: pages and chrome (flaky on Optimus laptops).

## Upstream notes (only once things are stable, one small issue per idea, no surprise PRs)

- FoxOne: a variable for the hard-coded 44px row [#6, label Drafts]; (landed in 3.9.1: nav hover delay [#17],
  hiding disabled Back/Forward [#18], the star and shield reveals [#1]); one shared config for chrome and
  content [#16, offered on FoxOne #50]; the Firefox View fix.
- Wintego: FF157+ dropdown fix (also paint `.urlbarView-background`); find-bar fix;
  the double-encoded text in his file; license-holder question.
  Wintego has no issues open and asks for pull requests instead, so these go to him as PRs.

## Done

- README "tested on" line: says Nightly 159, Nova on and off.
- Released 0.5 "Warts and all" (2026-10-07): FoxOne 3.8.7 [#14], [focused] fix [#15], new screenshot,
  dev files left out of the zip. Next releases: 0.5.1, 0.5.2 ... until 1.0.
- Nav-button hover delay, --ut-nav-delay [#17, closed]. Landed upstream as --uc-autohide-nav-delay (FoxOne 3.9.1, #58).
- Hide disabled Back/Forward, --ut-hide-disabled-nav [#18, closed]. Landed upstream as --uc-hide-disabled-nav-buttons
  (FoxOne 3.9.1, #54, #58). Only the Forward-alone option stays in our overrides.
- Charm and permission-icon delays [#1]: the URL-bar icons reveal when you rest on the bookmark star, the permission
  icons when you rest on the site-info icon or shield (FoxOne 3.9.1, #59; --uc-urlbar-icons-reveal). Our 7b/7c
  overrides and --ut-charms-on-hover, --ut-charm-delay, --ut-nav-delay are gone. Added --ut-hide-trust-label and
  --ut-hide-pip-button. Find-bar diacritics [#10] and the row-height variable [#6] also landed (3.8.8).
- Pulled FoxOne 3.9.1 (2026-10-11, branch 3.9.1-upstream-pull). Widths tuned: URL bar 30vw/224px collapsed,
  40vw/548px expanded; active tab 108-192px, inactive 48-66px, tab minimum 48px.
- One shared config file for chrome and content [#16, closed]. Offered on FoxOne #50 (closed there).
  Firn finds controlling the whole theme from 5 colours ambitious. Our answer is #8 (palette readability).
- 26. Tab fill/corners with Nova on [#11, closed]: fixed 2026-10-04 (background-clip on the
  selected tab). 25. Separators came back with it.
- 27. Outline only on the last tab: explained by 26. Nova changed how Firefox draws tabs; no fix needed.

- 15. userContent.css rebased on 3.8.5.
- 16. UI font as an option (switched-off block in userChrome.css).
- 17. CI workflow and check.mjs removed, so nothing to adapt.
- Repo published.
- Renamed to FoxMica (repo, folder, README), 2026-10-04.
