# 03 · Mobile (responsive layout)

## Goal

Prove Folio's layout switches correctly on two devices: the Pixel 10 Pro phone and the Galaxy Tab S9 tablet. The row counts as done when every scenario below passes in all three frameworks, in Chromium (Chrome in Cypress's Docker runs), in CI.

## Scope

- **In:** the app's navigation (sidebar or top bar) and the reader's contents (rail or drawer), on the Pixel 10 Pro and the Galaxy Tab S9.
- **Out:** Firefox and WebKit, any other device or size, real devices, touch gestures such as swiping pages, and installing Folio as an app.

## Test data

- **Book:** *Pride and Prejudice*, signed out.
- **Devices,** taken from Playwright's built-in presets:

| Device | Orientation | Viewport | Folio layout |
|---|---|---|---|
| Pixel 10 Pro | Portrait | 427 × 876 | Top bar, contents drawer |
| Galaxy Tab S9 | Portrait | 640 × 1024 | Top bar, contents drawer |
| Galaxy Tab S9 | Landscape | 1024 × 640 | Sidebar, contents rail |

- Reuses the page objects from [plan 01](01-browser-e2e-flows.md).

## What Folio does

- **From 1024px wide,** a fixed sidebar on the left holds the navigation.
- **Below 1024px,** a slim top bar replaces it, with a menu button that opens the same navigation in a drawer.
- **In the reader,** the contents are a rail from 900px wide, and a drawer below that.

The Galaxy Tab S9 in landscape is exactly 1024px wide, so MOB-01 also checks the sidebar breakpoint's edge.

## Scenarios

| ID | Scenario | Devices | Steps | Expected |
|---|---|---|---|---|
| MOB-01 | Tablet landscape shows the sidebar | Galaxy Tab S9 landscape | Open `/library` | The sidebar is visible, and there's no menu button |
| MOB-02 | Portrait shows the top bar | Pixel 10 Pro, Galaxy Tab S9 | Open `/library` | The menu button is visible, and the sidebar isn't |
| MOB-03 | Portrait menu opens the drawer | Pixel 10 Pro, Galaxy Tab S9 | Open `/library`, select the menu button | The drawer opens with the Library link |
| MOB-04 | Portrait reader uses a contents drawer | Pixel 10 Pro, Galaxy Tab S9 | Open chapter 1 of *Pride and Prejudice*, open the contents | The contents open as a drawer with a Close button |

## Framework notes

- **Playwright** gives each device a Chromium project in `playwright.config.ts`, using the presets `devices['Pixel 10 Pro']`, `devices['Galaxy Tab S9']` and `devices['Galaxy Tab S9 landscape']`. The portrait and landscape scenarios are in separate spec files, so each project runs only its own.
- **Cypress** has no device presets, so it sets each device's viewport with `cy.viewport(width, height)`.
- **Selenium** sets each device's viewport with WebDriver BiDi's `browsingContext.setViewport`, without Chrome's mobile emulation.
- Firefox runs skip the mobile tests in all three frameworks.
- These are layout checks, so only the size needs to match. Playwright's presets also set the user agent, pixel ratio and touch; Cypress and Selenium don't, and they don't need to.

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
