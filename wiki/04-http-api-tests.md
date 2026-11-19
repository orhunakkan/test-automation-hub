# 04 · HTTP API tests

## Goal

Prove Folio's HTTP endpoints answer correctly without a browser: a health check, the rules every request must follow, signing in, and one full create, change and delete cycle. The row counts as done when every scenario below passes in all three frameworks, in CI.

## Scope

- **In:** `/healthz`, the same-origin rule, signing in over HTTP, and shelves, which are the simplest endpoints to create and delete.
- **Out, for now:** endpoints that call outside services (Ask, translation, word lookup, read aloud), anything Pro-only, imports and the admin endpoints.

## Test data

- **Account:** the member account from `MEMBER_USERNAME` and `MEMBER_PASSWORD`.
- **Shelf names** include a timestamp, such as `api-test-1763500000`, so runs never clash with each other (a duplicate name gets 409).
- **Cleanup:** every test that creates a shelf deletes it at the end, even when the test fails.

## How Folio's API works

- **Same origin:** every POST must send an `Origin` header matching `https://dev.agenticlibrary.app`, or it gets 403.
- **Signing in:** `POST /login` is a form post (`username`, `password`). It answers with a 303 redirect to `/library` and sets the session cookie, `__Host-session`. Later requests send that cookie.
- **Signed out:** a JSON endpoint called without a session answers 401 with `signed_out`.
- **Shelves:** `POST /account/shelves/new` with `{ "name": … }` creates one (201, `{ shelf }`). `POST /account/shelves/<id>` with `{ "name": … }` renames it (200), and with `{ "intent": "delete" }` deletes it (200, `{ "deleted": true }`).

## Scenarios

| ID | Scenario | Request | Expected |
|---|---|---|---|
| API-01 | Health check | `GET /healthz` | 200, body `ok` |
| API-02 | Cross-site POST is refused | `POST /login` without an `Origin` header | 403 |
| API-03 | Member signs in | `POST /login` with the member's credentials and the right `Origin` | 303 to `/library`, with a session cookie |
| API-04 | Signed out is refused | `POST /account/shelves/new` with the right `Origin` but no session | 401, `signed_out` |
| API-05 | Shelf lifecycle | Sign in, create a shelf, rename it, delete it | 201 with the shelf, then 200 with the new name, then 200 with `deleted: true` |

## Framework notes

- **Where the tests go:** Playwright `tests/api/`, Cypress `cypress/e2e/api/`, Selenium a new `tests/api` package.
- **Tools:** Playwright's `request` fixture, Cypress's `cy.request`, and REST Assured for Selenium, which has no HTTP client of its own. REST Assured is added in the phase that first uses it.
- **Redirects:** the client must not follow the 303 in API-03, or the test can't see it.
- **Browsers:** API tests don't need a browser, but CI runs each suite once per browser, so they run twice. They're fast, so that's accepted for now. Changing it means changing the CI setup, which is a separate decision.

## Phases

| Phase | Change | Framework | Done |
|---|---|---|---|
| 1 | API-01 | Playwright | Yes |
| 2 | API-01 | Cypress | No |
| 3 | REST Assured, and API-01 | Selenium | No |
| 4 | API-02 | Playwright | No |
| 5 | API-02 | Cypress | No |
| 6 | API-02 | Selenium | No |
| 7 | API-03 | Playwright | No |
| 8 | API-03 | Cypress | No |
| 9 | API-03 | Selenium | No |
| 10 | API-04 | Playwright | No |
| 11 | API-04 | Cypress | No |
| 12 | API-04 | Selenium | No |
| 13 | API-05 | Playwright | No |
| 14 | API-05 | Cypress | No |
| 15 | API-05 | Selenium | No |
| 16 | Mark row 4 Done in ROADMAP.md | Repository | No |
