# TODO

Items marked [#n] are GitHub issues on snkiz/FoxMica; the issue holds the details.

Numbers are kept stable so old chats still make sense. Don't renumber. TODO items are written `tdN` (td24);
GitHub issues are `#N`. A bare number means nothing; always use the prefix.
Gathered from the three setup chats on 2026-10-04. The maintainer's own notes beat this list
where they disagree.

## Now

- **td24. Modal dialogs: background is back but black** [#4] (Nova on). Fixed the missing
  background 2026-10-04 by scoping section 1 of the Mica block (patches/userChrome/22-mica.css) to
  `#main-window` (it had made every chrome document transparent, dialogs included).
  Left to do: dialogs should use the theme palette, not black. Readable for now.
  Item td22 (the "make Firefox your default browser" bar) is the same dialog, so it gets fixed with this one.
- **td29. Bookmarks bar vs sidebar mismatch.** [#5] The sidebar is now properly translucent;
  the floating bookmarks bar is still solid, so it looks half on, half off. Ties in
  with td1. Test against a busy wallpaper (a brick pattern works well).

## Next time

- Nothing queued.

## First bug-fix pass

- td18. Selection contrast on about: pages [#7] (optional separate variable).
- td4. Sidebar button click target [#2]: fix in place, needs testing (override 7a+, in
  patches/userChrome/38-grab-and-nav.css). Cause: Firefox pads the first nav-bar button on purpose so a corner click
  hits it (browser-shared.css); not maximized, that ate our grab area.
- td2. Sidebar spacer: [#3] stop bookmarks/tools covering the minimized sidebar button.
  Maybe hide it when the sidebar is open.
- td28. [#13] Nova on: one animated built-in theme left the tab bar transparent. Fine with
  Nova off. Only one theme seen so far; check a few others before chasing it.
- td31. [#20] Fix the comment on the static bookmarks bar in foxmica-config.css: it says the static bar uses the
  translucent layer, but so far only Customize mode does. (Static on the layer is still the plan.)
- td34. Density moved: Nightly has dropped `browser.compactmode.show` entirely; the Customize -> Density switch
  now redirects to about:settings (Appearance). Not looked into yet. Check what ESR does, then update the README's
  about:config table (the `browser.compactmode.show` row) and the comment in foxmica-config.css (about line 53).
- td35. Reduced motion: check FoxMica (and FoxOne's reveals) with Windows' "Animation effects" off, which Firefox
  reports as `prefers-reduced-motion: reduce`. The hover reveals, tab and URL-bar transitions should go instant or
  near-instant. Raised on FoxOne #62.
- td36. In-flow bookmarks bar (`--ut-bookmarks-inflow: 1`), seen 2026-10-14:
  - Over-grows on reveal, then snaps to size when the pointer enters the bar. Cause: section 5's in-flow reveal
    (hover on the top row) still uses FoxOne's `max-height: 4em` + 6px padding; 5d only fixes the "pointer on the
    bar" case (28-bookmarks-bar.css and 32-bookmarks-height.css in patches/userChrome). Fix: give the in-flow
    reveal `--ut-bookmarks-height` and zero padding. Oddity: it didn't show with the generic icon width at 24px
    (was 26px, bar at 30px); re-check after the fix.
  - 1-2px gap under the active tab while the bar is collapsed: the bar's deliberate 2px sliver (opacity 0), from
    Wintego's version. Reason not written down.
  - The bar pushes the sidebar down with the page. Idea: negative top margin on the sidebar while the bar is open,
    so it reaches up into the bar's row and stays put.
  - Flicker looked fine on Nightly with hardware acceleration off.
- td37. Overlay bookmarks bar (default) stops at the sidebar launcher: start the bar at the collapsed launcher's right
  edge so it doesn't cover the icons; the open sidebar panel covers the bar (or the bar sits over it, test both).
  Must follow the sidebar live: anchor positioning (as FoxOne pins the hamburger), with a fallback to the window
  edge when the sidebar is hidden, so the bar goes full width. May need the bar switched from absolute to fixed
  (anchor rules). Jumps rather than slides; fine for a bar that only shows on hover. Experiment first, test profile.

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
- td8. [#24] Stock-plus mode: turn off the one-line bar but keep the other goodies. Needs
  every feature switchable, and testing each feature off.
  macOS lead (from Firn, unverified, nobody here has a Mac): the closest thing to Mica is the older vibrancy
  blur, `widget.macos.titlebar-blend-mode.behind-window` in about:config. Liquid-fox and zvuc's
  firefox-macos-native-tabbar build their glass look on it. FoxMica could swap that pref for the Mica one and
  keep its transparency layer. Needs: a Mac tester, and a check that the pref still works on current releases.
- td12. [#22] Backport to ESR 153. Check the Nova pref name there. Test Nova on and off.
- td39. [#22] ESR 153: the selected tab's text shows the dark accent colour instead of white. Release 160 is fine, so
  something changed between 153 and 157. Lead, not checked: FoxOne sets `--tab-text-color-selected` to the accent (about
  line 634) and FoxOne's own rules use `--tab-selected-textcolor`; foxmica-tabs.css only overrides the first, so 153 may
  read the other name. Compare the tab text variables on 153 and 160 before changing anything.
- td13. [#27] Tab-drag test against upstream's fix (FoxOne 3.8.5, about line 2746).
- td38. New-tab "+" and other movable buttons: leave placement to the user. FoxOne reserves a fixed width for the "+"
  (`--uc-newtab-width`, vendor/userChrome.css about line 1085, a subtraction from the tab strip's max-width), so a
  button dragged elsewhere can overlap its neighbours (FoxOne PR #65 fixes one case). Investigate how the row is laid
  out (tabs, "+", extensions) before deciding: can the tab strip take the leftover room instead of a hard-coded width?
  Touch user-placed buttons as little as possible. Decide whether it belongs in td8 or is a note for FoxOne.
- td6, td7, td21. [#25] Theme-aware tint like WinUI (Mica grey tinted by accent/wallpaper),
  theme picker support, inherit Windows system colours. Do these together.
- td30. Palette readability [#8]: pick palette ratios so every text/background pair stays
  readable (4.5:1 for text, 3:1 for icons and large text), whatever colours are
  chosen. Found while drafting td18 (selected text is about 1.8:1). Ties in with td6, td7, td21.
- [#26] Five-colour palette: only the main five colours in the user config, the rest derived and moved
  to an advanced section. Depends on #25 and #8.
- td1. Bookmarks bar on new tab: [#5] drop the background, clear tint with just enough
  contrast for the text.
- td5. [#23] Scaling: "certified good enough", poke at it later.
- td19. [#28] Try `widget.windows.mica.popups` (it's 0 in the good profile's user.js).
- td20. [#29] Check `widget.windows.apply-dwm-resize-hack` with Mica (fullscreen from maximized).
- td10. Tab right-click menu: it's far too long. Trim it and reorder it with CSS (hide unused items, move
  Reopen Closed Tab to the top; untested idea: `#context_undoCloseTab { order: -1; }`). Plus a small
  extension for "New Tab to the Left" (no add-on found that does left; extensions can add items but
  not place them at the top).
- [#31] Vertical tabs are untested. Firn notes vertical tabs change `--tabstrip-min-height` (bar-height overrides).
- [#21] Refactor: done for 0.8 as five files (loader, built foxone-mica.css, config, tabs, built userContent.css), with
  FoxOne untouched in vendor/, our changes in patches/ and the tooling in scripts/ (scripts/README.md). The config has an
  easy and an advanced section. Still open from the original idea: trim the very long comments. The mode switch for
  stock-plus is td8.

## Maybe, probably never

- td9. Fully transparent about: pages and chrome (flaky on Optimus laptops).

## Upstream notes (only once things are stable, one small issue per idea, no surprise PRs)

- FoxOne: a variable for the hard-coded 44px row [#6, label Drafts]; (landed in 3.9.1: nav hover delay [#17],
  hiding disabled Back/Forward [#18], the star and shield reveals [#1]);
  extension icons before the tabs [landed in 3.9.4: FoxOne #62/#63, with #32]; one shared config for chrome and
  content [#16, offered on FoxOne #50]; the Firefox View fix.
- Wintego: FF157+ dropdown fix (also paint `.urlbarView-background`); find-bar fix;
  the double-encoded text in his file; license-holder question.
  Wintego has no issues open and asks for pull requests instead, so these go to him as PRs.

## Done

- Pulled FoxOne 3.9.4 "Icons where you put them" (2026-10-13, branch Pull-3.9.4-to-0.7.1, for 0.7.1). Our #62 fix
  landed upstream as #63 (Firn added `[hidden]` for FF158's Smart Window buttons). Closes #32: Customize-mode overrun.
  Tested FoxOne and FoxMica on 3.9.4 in all three Firefox versions.
- 2026-10-12 check-in: section 4 (bar height) checked against `--uc-row-height`, all good. userContent.css is on
  FoxOne 3.9.1 (#33). README is current with 0.7, including the Customize-mode quirks and the hover-reveal notes.
- td23. Hide nav controls while typing [#1]: done as click-to-cancel (override 7e, mode 2).
- td33. Tab bar does not overrun the buttons; the extension hover pushes them, and so do the tools tried.
- Gave up, issues closed: td14, white tab-loading highlight [#12]; td32, pinning the overflow button [#19].
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
- Click into the URL text cancels the nav reveal (override 7e, mode 2 only), rewritten against 3.9.1's selectors.
  Firn's hot-area change only covers the star.
- Pulled FoxOne 3.9.1 (2026-10-11, branch 3.9.1-upstream-pull). Widths tuned: URL bar 30vw/224px collapsed,
  40vw/548px expanded; active tab 108-192px, inactive 48-66px, tab minimum 48px.
- One shared config file for chrome and content [#16, closed]. Offered on FoxOne #50 (closed there).
  Firn finds controlling the whole theme from 5 colours ambitious. Our answer is #8 (palette readability).
- td26. Tab fill/corners with Nova on [#11, closed]: fixed 2026-10-04 (background-clip on the
  selected tab). td25. Separators came back with it.
- td27. Outline only on the last tab: explained by td26. Nova changed how Firefox draws tabs; no fix needed.

- td15. userContent.css rebased on 3.8.5.
- td16. UI font as an option (switched-off block in userChrome.css).
- td17. CI workflow and check.mjs removed, so nothing to adapt.
- Repo published.
- Renamed to FoxMica (repo, folder, README), 2026-10-04.
