# 04 · HTTP API tests

## Goal

Prove Folio's HTTP endpoints answer correctly without a browser: a health check, the rules every request must follow, signing in, and one full create, change and delete cycle, each with both of Folio's ways to sign in: the session cookie and a bearer access token. The row counts as done when every scenario below passes in all three frameworks, in CI.

## Scope

- **In:** `/healthz`, the same-origin rule, signing in over HTTP as the member and the admin, access tokens (create, use, revoke), `/api/me`, and shelves, which are the simplest endpoints to create and delete.
- **Out, for now:** endpoints that call outside services (Ask, translation, word lookup, read aloud), anything Pro-only, imports and the admin endpoints. Wrong-password token requests too: each failure counts toward the member's sign-in lock (5 in 15 minutes).

## Test data

- **Accounts:** the member account from `MEMBER_USERNAME` and `MEMBER_PASSWORD`. The admin account, from `ADMIN_USERNAME` and `ADMIN_PASSWORD`, is used only to sign in.
- **Shelf names** include a timestamp, such as `api-test-1763500000`, so runs never clash with each other (a duplicate name gets 409).
- **Token names** include a timestamp too, such as `api-test-1763500000`, and every token is made with `expiresInDays: 1`.
- **Cleanup:** every test that creates a shelf deletes it, and every test that creates a token revokes it, at the end, even when the test fails. An account can have only 10 live tokens, so a leaked token takes a slot until it expires.

## How Folio's API works

- **Same origin:** every POST must send an `Origin` header matching `https://dev.agenticlibrary.app`, or it gets 403.
- **Signing in:** `POST /login` is a form post (`username`, `password`). It answers with a 303 redirect to `/library` and sets the session cookie, `__Host-session`. Later requests send that cookie.
- **Signed out:** a JSON endpoint called without a session answers 401 with `signed_out`.
- **Access tokens:** `POST /api/tokens` with JSON `{ "username", "password", "name", "expiresInDays" }` creates one (201, `{ token, tokenType: "Bearer", expiresAt, id, name }`); the token starts with `folio_at_`. Later requests send `Authorization: Bearer <token>`. A request with a token needs no `Origin` header, but a foreign `Origin` still gets 403. When the header is sent, it alone decides; the cookie isn't used.
- **Revoking:** `POST /api/tokens/current` with `{ "intent": "revoke" }` revokes the token the request uses (200, `{ "revoked": true }`). A revoked, expired or malformed token gets 401 `signed_out` with `WWW-Authenticate: Bearer error="invalid_token"`.
- **Who am I:** `GET /api/me` takes the cookie or a token and answers 200 `{ username, role, plan, via }`, where `via` is `cookie` or `token`.
- **Shelves:** `POST /account/shelves/new` with `{ "name": … }` creates one (201, `{ shelf }`). `POST /account/shelves/<id>` with `{ "name": … }` renames it (200), and with `{ "intent": "delete" }` deletes it (200, `{ "deleted": true }`).

## Scenarios

| ID | Scenario | Request | Expected |
|---|---|---|---|
| API-01 | Health check | `GET /healthz` | 200, body `ok` |
| API-02 | Cross-site POST is refused | `POST /login` without an `Origin` header | 403 |
| API-03 | Member signs in | `POST /login` with the member's credentials and the right `Origin` | 303 to `/library`, with a session cookie |
| API-04 | Signed out is refused | `POST /account/shelves/new` with the right `Origin` but no session | 401, `signed_out` |
| API-05 | Shelf lifecycle | Sign in, create a shelf, rename it, delete it | 201 with the shelf, then 200 with the new name, then 200 with `deleted: true` |
| API-06 | Member creates a token | `POST /api/tokens` with the member's credentials and `expiresInDays: 1` | 201, a token starting with `folio_at_`, `tokenType` `Bearer` |
| API-07 | Who am I, by cookie and by token | `GET /api/me` with the session cookie, then with a token | 200 with the member's username both times, `via` `cookie`, then `token` |
| API-08 | Shelf lifecycle with a token | Create a token, then create, rename and delete a shelf with it, sending no `Origin` header | 201 with the shelf, then 200 with the new name, then 200 with `deleted: true` |
| API-09 | Revoked token is refused | Create a token, revoke it, then `GET /api/me` with it | 200 with `revoked: true`, then 401 with `WWW-Authenticate: Bearer error="invalid_token"` |
| API-10 | Admin signs in | `POST /login` with the admin's credentials and the right `Origin` | 303 to `/library`, with a session cookie |

## Framework notes

- **Where the tests go:** Playwright `tests/api/`, Cypress `cypress/e2e/api/`, Selenium a new `tests/api` package.
- **Tools:** Playwright's `request` fixture, Cypress's `cy.request`, and REST Assured for Selenium, which has no HTTP client of its own. REST Assured is added in the phase that first uses it.
- **Sending a token:** Playwright and Cypress pass `headers: { Authorization: … }` on each request; REST Assured uses `.auth().oauth2(token)`. Cookies and tokens are kept in separate tests, so no request sends both.
- **Redirects:** the client must not follow the 303 in API-03, or the test can't see it.
- **Browsers:** API tests don't need a browser, but CI runs each suite once per browser, so they run twice. They're fast, so that's accepted for now. Changing it means changing the CI setup, which is a separate decision.

## Phases

| Phase | Change | Framework | Done |
|---|---|---|---|
| 1 | API-01 | Playwright | Yes |
| 2 | API-01 | Cypress | Yes |
| 3 | REST Assured, and API-01 | Selenium | Yes |
| 4 | API-02 | Playwright | Yes |
| 5 | API-02 | Cypress | Yes |
| 6 | API-02 | Selenium | Yes |
| 7 | API-03 | Playwright | Yes |
| 8 | API-03 | Cypress | Yes |
| 9 | API-03 | Selenium | Yes |
| 10 | API-04 | Playwright | Yes |
| 11 | API-04 | Cypress | Yes |
| 12 | API-04 | Selenium | Yes |
| 13 | API-05 | Playwright | Yes |
| 14 | API-05 | Cypress | Yes |
| 15 | API-05 | Selenium | Yes |
| 16 | API-06 | Playwright | Yes |
| 17 | API-06 | Cypress | Yes |
| 18 | API-06 | Selenium | Yes |
| 19 | API-07 | Playwright | Yes |
| 20 | API-07 | Cypress | Yes |
| 21 | API-07 | Selenium | Yes |
| 22 | API-08 | Playwright | Yes |
| 23 | API-08 | Cypress | Yes |
| 24 | API-08 | Selenium | Yes |
| 25 | API-09 | Playwright | No |
| 26 | API-09 | Cypress | No |
| 27 | API-09 | Selenium | No |
| 28 | API-10 | Playwright | No |
| 29 | API-10 | Cypress | No |
| 30 | API-10 | Selenium | No |
| 31 | Mark row 4 Done in ROADMAP.md | Repository | No |
