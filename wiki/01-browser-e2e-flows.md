# 01 · Browser end-to-end flows

## Goal

Prove a reader's core journeys work on dev in a real browser: browsing the library, opening a book, reading, searching, and signing in and out. Along the way, build the pieces every later row reuses: page objects and a sign-in helper.

The row counts as done when every scenario below passes in all three frameworks, in Chromium and Firefox, in CI. Flows for other features (highlights, bookmarks, shelves, the admin pages) are added later, when a later row or a new plan needs them.

## Scope

- **In:** the library page, the book page, the reader, library search, signing in and out.
- **Out, for now:** everything that writes data (highlights, bookmarks, shelves, imports), admin pages, sign-up and password reset (they send email, and dev's mail quota is small).

## Test data

- **Book:** the catalogue has one book, *Pride and Prejudice*: its page is `/library/jane-austen/pride-and-prejudice`.
- **Accounts:** two users, the member (`MEMBER_USERNAME`, `MEMBER_PASSWORD`) and the admin (`ADMIN_USERNAME`, `ADMIN_PASSWORD`), already in each framework's `.env` and the repository's Actions secrets. Both land on `/library` after signing in. The sign-in scenarios run once for each user, with titles such as `member signs in` and `admin signs in`.
- **Wrong-password tests** use a username that doesn't exist, such as `e2e-no-such-user`. Five failures lock a username for 15 minutes, so a real account must never be used for them.
- **Signed out by default.** A signed-in reader sees their own copy of *Pride and Prejudice* in place of the catalogue's, so the reading scenarios run signed out.

## Before interacting

Folio renders on the server and then hydrates. When hydration finishes it sets `data-hydrated="true"` on `<html>`. Every page object's `open()` waits for that attribute before the test touches the page, or clicks can land before React is listening.

## Scenarios

| ID | Scenario | Steps | Expected |
|---|---|---|---|
| E2E-01 | Library loads | Open `/library` | The "Library" heading is visible |
| E2E-02 | Each user signs in | For the member and the admin: open `/login`, enter the user's username and password, submit | Lands on `/library`, and the account menu shows instead of "Sign in" |
| E2E-03 | Wrong password is refused | Open `/login`, enter `e2e-no-such-user` and any password, submit | The error reads "Username or password is incorrect." |
| E2E-04 | Each user signs out | For the member and the admin: start signed in with the sign-in helper, open the account menu, choose Sign out | "Sign in" shows again |
| E2E-05 | Library opens a book | Open `/library`, select *Pride and Prejudice* | The book page opens with the book's title and "Start reading" |
| E2E-06 | Start reading | On the book page, select "Start reading" | The reader opens at chapter 1, and the bottom bar reads "Chapter 1 · Page 1 of …" |
| E2E-07 | Turn a page | In the reader, select next | The bottom bar's page number goes up by one |
| E2E-08 | Search finds a book | On `/library`, search for "pride" | *Pride and Prejudice* is shown, and the count reads "Showing 1 book" |
| E2E-09 | Search with no match | On `/library`, search for a word no title has | No book is shown, and the count reads "Showing 0 books" |

The labels and status codes in this plan were checked on dev on 18 November 2026. The reader's page label only appears after hydration.

## Framework notes

- **Selectors:** each framework follows its own documentation. Folio gives every element a test touches a `data-testid` (see its `docs/conventions.md`, "Test ids"), so no scenario needs an app change to be located. Playwright locates by role, label and text first, with `getByTestId` last. Cypress and Selenium locate everything by `data-testid`. No raw CSS or XPath selectors; each framework's lint or Checkstyle enforces its rule.
- **Page objects** go in each framework's `pages/` folder, one class per page.
- **Sign-in helper:** each framework signs in the way its official documentation recommends, so tests that only need a signed-in user don't go through the sign-in form. It signs in each user, the member and the admin, and keeps a separate session for each. E2E-02 is the one test that signs in through the form, because the form is what it tests. Tests stay signed out unless they opt in.
  - **Playwright:** a `setup` project signs each user in once and saves their session with `storageState` to `playwright/.auth/member.json` and `playwright/.auth/admin.json`. Tests that need one opt in with `test.use({ storageState })` ([Authentication](https://playwright.dev/docs/auth), "Multiple signed in roles"). The setup signs in with a `POST /login` request, not the form, through a `signIn` fixture. Folio deletes the session on sign-out, so a test that ends its session, such as E2E-04, calls `signIn` for a session of its own instead of loading a saved one.
  - **Cypress:** a `cy.signIn(user)` command in `cypress/support/commands.js` that signs in with a `POST /login` request inside `cy.session`, with one session per user, cached across specs. Its `validate` checks the session still works, so after E2E-04 signs a cached session out, the next `cy.signIn` signs in again ([cy.session](https://on.cypress.io/session)).
  - **Selenium:** `SignIn.as(driver, user)` in `support/` signs in with a `POST /login` request from Java's `HttpClient` and adds the session cookie to the browser, as Selenium's [Generating application state](https://www.selenium.dev/documentation/test_practices/encouraged/generating_application_state/) recommends ("use an API to login and set a cookie"). Each test gets a fresh session, with nothing cached between tests, following its [Avoid sharing state](https://www.selenium.dev/documentation/test_practices/encouraged/avoid_sharing_state/).

## Phases

| Phase | Change | Framework | Done |
|---|---|---|---|
| 1 | Library page object, and E2E-01 using it | Playwright | Yes |
| 2 | Library page object, and E2E-01 using it | Cypress | Yes |
| 3 | Library page object, and E2E-01 using it | Selenium | Yes |
| 4 | Sign-in page object, and E2E-02 | Playwright | Yes |
| 5 | Sign-in page object, and E2E-02 | Cypress | Yes |
| 6 | Sign-in page object, and E2E-02 | Selenium | Yes |
| 7 | Sign-in helper, and E2E-04 using it | Playwright | Yes |
| 8 | Sign-in helper, and E2E-04 using it | Cypress | Yes |
| 9 | Sign-in helper, and E2E-04 using it | Selenium | Yes |
| 10 | E2E-03 | Playwright | Yes |
| 11 | E2E-03 | Cypress | Yes |
| 12 | E2E-03 | Selenium | Yes |
| 13 | Book page object, and E2E-05 | Playwright | Yes |
| 14 | Book page object, and E2E-05 | Cypress | Yes |
| 15 | Book page object, and E2E-05 | Selenium | Yes |
| 16 | Reader page object, and E2E-06 and E2E-07 | Playwright | No |
| 17 | Reader page object, and E2E-06 and E2E-07 | Cypress | No |
| 18 | Reader page object, and E2E-06 and E2E-07 | Selenium | No |
| 19 | E2E-08 and E2E-09 | Playwright | No |
| 20 | E2E-08 and E2E-09 | Cypress | No |
| 21 | E2E-08 and E2E-09 | Selenium | No |
| 22 | Mark row 1 Done in ROADMAP.md | Repository | No |
