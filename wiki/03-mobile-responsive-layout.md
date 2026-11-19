# 03 · Mobile (responsive layout)

## Goal

Prove Folio's layout switches correctly between desktop and phone widths. The row counts as done when every scenario below passes in all three frameworks, in Chromium and Firefox, in CI.

## Scope

- **In:** the app's navigation (sidebar or top bar) and the reader's contents (rail or drawer), at a phone width and a desktop width.
- **Out:** real devices, touch gestures such as swiping pages, and installing Folio as an app.

## Test data

- **Book:** *Pride and Prejudice*, signed out.
- **Phone size:** 390 × 844. **Desktop size:** 1280 × 800.
- Reuses the page objects from [plan 01](01-browser-e2e-flows.md).

## What Folio does

- **From 1024px wide,** a fixed sidebar on the left holds the navigation.
- **Below 1024px,** a slim top bar replaces it, with a menu button that opens the same navigation in a drawer.
- **In the reader,** the contents are a rail from 900px wide, and a drawer below that.

## Scenarios

| ID | Scenario | Steps | Expected |
|---|---|---|---|
| MOB-01 | Desktop shows the sidebar | At desktop size, open `/library` | The sidebar is visible, and there's no menu button |
| MOB-02 | Phone shows the top bar | At phone size, open `/library` | The menu button is visible, and the sidebar isn't |
| MOB-03 | Phone menu opens the drawer | At phone size, open `/library`, select the menu button | The drawer opens with the Library link |
| MOB-04 | Phone reader uses a contents drawer | At phone size, open chapter 1 of *Pride and Prejudice*, open the contents | The contents open as a drawer with a Close button |

## Framework notes

- **Setting the size:** Playwright with `test.use({ viewport })`, Cypress with `cy.viewport`, Selenium by resizing the window. All three work in both browsers.
- These are layout checks, so they set a size only. Full device emulation (user agent, touch) isn't needed.

## Phases

| Phase | Change | Framework | Done |
|---|---|---|---|
| 1 | MOB-01 and MOB-02 | Playwright | No |
| 2 | MOB-01 and MOB-02 | Cypress | No |
| 3 | MOB-01 and MOB-02 | Selenium | No |
| 4 | MOB-03 | Playwright | No |
| 5 | MOB-03 | Cypress | No |
| 6 | MOB-03 | Selenium | No |
| 7 | MOB-04 | Playwright | No |
| 8 | MOB-04 | Cypress | No |
| 9 | MOB-04 | Selenium | No |
| 10 | Mark row 3 Done in ROADMAP.md | Repository | No |
