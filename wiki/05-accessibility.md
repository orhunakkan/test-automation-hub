# 05 · Accessibility

## Goal

Prove Folio's main screens have no automatically detectable WCAG 2.1 A or AA failures, with an axe scan of each screen in a real browser. The row counts as done when every scenario below passes in all three frameworks, in Chromium and Firefox, in CI.

## Scope

- **In:** an axe scan of the library (signed out and signed in), the book page, the reader, the sign-in page with and without its error, and the account page.
- **Out, for now:** the phone and tablet layouts and their drawers, open menus and dialogs, the admin pages, Pro-only screens, anything that writes data, WCAG 2.2 and axe's best-practice rules, and what axe can't check, such as screen readers and keyboard-only use.

## Test data

- **Book:** *Pride and Prejudice*, signed out, as in [plan 01](01-browser-e2e-flows.md).
- **Accounts:** the member, signed in with each framework's sign-in helper, for A11Y-06 and A11Y-07.
- **Wrong password:** A11Y-05 uses `e2e-no-such-user`, as E2E-03 does, so no real account counts toward a lock.
- Reuses the page objects from plan 01. The account page gets a new one.
- Nothing is written, so there's nothing to clean up.

## How the scan works

- **Rules:** only the rules tagged `wcag2a`, `wcag2aa`, `wcag21a` and `wcag21aa`, the same set Folio's own suite uses. No rule and no element is excluded.
- **When:** after the page has hydrated and no fade or slide is running. A colour checked mid-fade reads as a contrast failure. Folio's own scan waits the same way.
- **Result:** the scan returns one line per violation, `id (impact): help at <first five elements>`. The test asserts the list is empty, so a failure shows what broke and where. The helper only scans; the assertion is in the test.
- **Right screen first:** before scanning, the test checks the screen it expects is showing, such as the library's heading or the account's title, so a redirect can't pass with a clean scan of the wrong page.
- **Same engine:** all three frameworks run axe-core 4.14, so a page gets the same rules everywhere.

Every scenario below scanned clean on dev on 20 November 2026, in Chromium and Firefox. A scan that fails later is a regression in Folio: report it with the violation lines, and never exclude the rule or element to make it pass.

## Scenarios

| ID | Scenario | Steps | Expected |
|---|---|---|---|
| A11Y-01 | Library is accessible | Open `/library`, signed out, and scan | No violations |
| A11Y-02 | Book page is accessible | Open the *Pride and Prejudice* book page and scan | No violations |
| A11Y-03 | Reader is accessible | Open chapter 1 of *Pride and Prejudice* and scan | No violations |
| A11Y-04 | Sign-in page is accessible | Open `/login` and scan | No violations |
| A11Y-05 | Sign-in error is accessible | Open `/login`, sign in as `e2e-no-such-user`, wait for the error, and scan | No violations |
| A11Y-06 | Signed-in library is accessible | Sign in as the member with the helper, open `/library`, and scan | No violations |
| A11Y-07 | Account page is accessible | Sign in as the member with the helper, open `/account`, and scan | No violations |

## Framework notes

- **Where the tests go:** Playwright `tests/a11y/`, Cypress `cypress/e2e/a11y/`, Selenium a new `tests/a11y` package. They run in the desktop browsers only, not on the mobile devices from plan 03.
- **Playwright:** `@axe-core/playwright`, Deque's own package and the one Folio's suite uses, with `new AxeBuilder({ page }).withTags(…).analyze()`. The scan is the `axeViolations` fixture in `fixtures/index.ts`. In Playwright's Firefox, locating anything inside the account menu by label or text, in the same page as an axe scan, crashes the page every time. It's a browser bug, not an accessibility failure, so A11Y-06 checks the "Sign in" link is gone instead of checking the account menu.
- **Cypress:** `axe-core` itself, not `cypress-axe`. `cypress-axe` 1.7.0 only lists Cypress up to 15 as a peer, so npm refuses it next to Cypress 16.3.0. Its Cypress 16 support is merged but unreleased, because its release pipeline is broken ([#194](https://github.com/component-driven/cypress-axe/issues/194), [#196](https://github.com/component-driven/cypress-axe/issues/196)). A `cy.axeViolations()` command in `cypress/support/commands.js` reads `axe-core/axe.min.js` with `cy.readFile`, loads it into the app's window and runs `axe.run` there, which is what `cypress-axe` does itself. Importing `axe-core` doesn't work: the bundler wraps it, and `axe.source` then fails in the page. Revisit once `cypress-axe` releases Cypress 16 support.
- **Selenium:** Deque's `com.deque.html.axe-core:selenium`, with `new AxeBuilder().withTags(…).analyze(driver)`, in `Accessibility.violations(driver)` in `support/`, which throws if axe itself fails. It depends on `selenium-java` 4.13.0 and WebDriverManager: the pom's own `selenium-java` 4.53.0 wins, and WebDriverManager is excluded, because the framework doesn't use it.
- **Libraries are added** in the phase that first uses them, at exact versions, like every other dependency.

## Phases

| Phase | Change | Framework | Done |
|---|---|---|---|
| 1 | `@axe-core/playwright`, the scan fixture, and A11Y-01 | Playwright | Yes |
| 2 | `axe-core`, `cy.axeViolations()`, and A11Y-01 | Cypress | Yes |
| 3 | axe-core for Selenium, the scan helper, and A11Y-01 | Selenium | Yes |
| 4 | A11Y-02 and A11Y-03 | Playwright | Yes |
| 5 | A11Y-02 and A11Y-03 | Cypress | Yes |
| 6 | A11Y-02 and A11Y-03 | Selenium | Yes |
| 7 | A11Y-04 and A11Y-05 | Playwright | Yes |
| 8 | A11Y-04 and A11Y-05 | Cypress | Yes |
| 9 | A11Y-04 and A11Y-05 | Selenium | Yes |
| 10 | Account page object, and A11Y-06 and A11Y-07 | Playwright | Yes |
| 11 | Account page object, and A11Y-06 and A11Y-07 | Cypress | Yes |
| 12 | Account page object, and A11Y-06 and A11Y-07 | Selenium | Yes |
| 13 | Mark row 5 Done in ROADMAP.md, and name `axe-core` in its Cypress cell | Repository | No |
