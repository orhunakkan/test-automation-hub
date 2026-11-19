# 01 · Browser end-to-end flows

## Goal

Prove a reader's core journeys work on dev in a real browser: browsing the library, opening a book, reading, searching, and signing in and out. Along the way, build the pieces every later row reuses: page objects and a sign-in helper.

The row counts as done when every scenario below passes in all three frameworks, in Chromium and Firefox, in CI. Flows for other features (highlights, bookmarks, shelves, the admin pages) are added later, when a later row or a new plan needs them.

## Scope

- **In:** the library page, the book page, the reader, library search, signing in and out.
- **Out, for now:** everything that writes data (highlights, bookmarks, shelves, imports), admin pages, sign-up and password reset (they send email, and dev's mail quota is small).

## Test data

- **Book:** the catalogue has one book, *Pride and Prejudice*: its page is `/library/jane-austen/pride-and-prejudice`.
- **Accounts:** the member account from `MEMBER_USERNAME` and `MEMBER_PASSWORD`, already in each framework's `.env` and the repository's Actions secrets.
- **Wrong-password tests** use a username that doesn't exist, such as `e2e-no-such-user`. Five failures lock a username for 15 minutes, so a real account must never be used for them.
- **Signed out by default.** A signed-in reader sees their own copy of *Pride and Prejudice* in place of the catalogue's, so the reading scenarios run signed out.

## Before interacting

Folio renders on the server and then hydrates. When hydration finishes it sets `data-hydrated="true"` on `<html>`. Every page object's `open()` waits for that attribute before the test touches the page, or clicks can land before React is listening.

## Scenarios

| ID | Scenario | Steps | Expected |
|---|---|---|---|
| E2E-01 | Library loads | Open `/library` | The "Library" heading is visible |
| E2E-02 | Member signs in | Open `/login`, enter the member's username and password, submit | Lands on `/library`, and the account menu shows instead of "Sign in" |
| E2E-03 | Wrong password is refused | Open `/login`, enter `e2e-no-such-user` and any password, submit | Stays on the sign-in page with "Username or password is incorrect" |
| E2E-04 | Member signs out | Sign in, open the account menu, choose Sign out | "Sign in" shows again |
| E2E-05 | Library opens a book | Open `/library`, select *Pride and Prejudice* | The book page opens with the book's title and "Start reading" |
| E2E-06 | Start reading | On the book page, select "Start reading" | The reader opens at chapter 1, and the bottom bar reads "Chapter 1 · Page 1 of …" |
| E2E-07 | Turn a page | In the reader, select next | The bottom bar's page number goes up by one |
| E2E-08 | Search finds a book | On `/library`, search for "pride" | *Pride and Prejudice* is shown, and the count reads "Showing 1 book" |
| E2E-09 | Search with no match | On `/library`, search for a word no title has | No book is shown, and the count reads "Showing 0 books" |

The labels and status codes in this plan were checked on dev on 18 November 2026. The reader's page label only appears after hydration.

## Framework notes

- **Selectors:** use what each tool's official documentation recommends, which starts with what a user sees: roles, labels and text. No raw CSS or XPath selectors. Folio has no `data-testid` attributes yet; when nothing a user sees identifies an element, add the attribute the tool recommends to Folio's source rather than fall back to a raw selector.
- **Page objects** go in each framework's `pages/` folder, one class per page.
- **Sign-in helper:** Playwright as a fixture in `fixtures/index.ts`, Cypress as a custom command in `cypress/support/commands.js` (with `cy.session` to reuse the session), Selenium as a method on the sign-in page object.

## Phases

| Phase | Change | Framework | Done |
|---|---|---|---|
| 1 | Library page object, and E2E-01 using it | Playwright | Yes |
| 2 | Library page object, and E2E-01 using it | Cypress | Yes |
| 3 | Library page object, and E2E-01 using it | Selenium | Yes |
| 4 | Sign-in page object, and E2E-02 | Playwright | No |
| 5 | Sign-in page object, and E2E-02 | Cypress | No |
| 6 | Sign-in page object, and E2E-02 | Selenium | No |
| 7 | E2E-03 | Playwright | No |
| 8 | E2E-03 | Cypress | No |
| 9 | E2E-03 | Selenium | No |
| 10 | Sign-in helper, and E2E-04 using it | Playwright | No |
| 11 | Sign-in helper, and E2E-04 using it | Cypress | No |
| 12 | Sign-in helper, and E2E-04 using it | Selenium | No |
| 13 | Book page object, and E2E-05 | Playwright | No |
| 14 | Book page object, and E2E-05 | Cypress | No |
| 15 | Book page object, and E2E-05 | Selenium | No |
| 16 | Reader page object, and E2E-06 and E2E-07 | Playwright | No |
| 17 | Reader page object, and E2E-06 and E2E-07 | Cypress | No |
| 18 | Reader page object, and E2E-06 and E2E-07 | Selenium | No |
| 19 | E2E-08 and E2E-09 | Playwright | No |
| 20 | E2E-08 and E2E-09 | Cypress | No |
| 21 | E2E-08 and E2E-09 | Selenium | No |
| 22 | Mark row 1 Done in ROADMAP.md | Repository | No |
