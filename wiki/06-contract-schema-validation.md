# 06 · Contract and schema validation

## Goal

Prove Folio's HTTP API answers what its contract, [openapi/folio.yaml](openapi/folio.yaml), says it does: every response's status, body and documented headers match the spec, for the success answers and the error answers a test can safely cause. The row counts as done when every scenario below passes in all three frameworks, in CI.

## Scope

- **In:** the seven operations in the spec: creating, listing and revoking access tokens, `/api/me`, and creating, changing and deleting shelves and putting books on them. Their success answers, and the error answers `400`, `401`, `403`, `404`, `413` and `415`.
- **Out, for now:** `429` and `401 invalid_credentials`, because each wrong sign-in counts toward the member's sign-in lock (5 in 15 minutes); the `409` quotas, which need 10 live tokens or 50 shelves; `500` and `503`, which dev can't be made to answer on purpose; and checking request bodies against the spec, since the tests write their own.

## Test data

- **Accounts:** the member account, from `MEMBER_USERNAME` and `MEMBER_PASSWORD`, signed in with each framework's token helper from [plan 04](04-http-api-tests.md), and with its session cookie for CON-03.
- **Book:** *Pride and Prejudice* (`pride-and-prejudice`), as in [plan 01](01-browser-e2e-flows.md), for CON-05.
- **Names** include a timestamp, such as `api-test-1763500000`, as in plan 04, and every token is made with `expiresInDays: 1`.
- **Cleanup:** every test that creates a shelf deletes it, and every test that creates a token revokes it, at the end, even when the test fails.

## How the check works

- **The spec:** [openapi/folio.yaml](openapi/folio.yaml), OpenAPI 3.1, hand-written from Folio's handlers. Its schemas are JSON Schema 2020-12, and every object in an answer is `additionalProperties: false`, so a missing, extra or wrongly typed field fails.
- **One copy per framework:** each framework keeps an identical copy, so no file is shared between them. The wiki's copy is the reference. When Folio's API changes, the wiki's copy changes first, then each framework's copy in that framework's own commit. A framework's copy is never edited on its own.
- **The validator:** each framework has a small helper that takes an `operationId`, such as `createAccessToken`, and a response. It finds that operation's answer for the response's status in the spec and returns one line per mismatch, such as `status 418 isn't in the spec for createAccessToken` or `body /shelf/name: must be string`. It checks:
  - that the status is listed for the operation
  - the body, against the schema for the response's content type (JSON, or plain text for a foreign `Origin`)
  - each header the answer documents with a schema: `Cache-Control` and `WWW-Authenticate`
- **Result:** the helper doesn't assert. The test asserts the list is empty, so a failure shows every mismatch at once, as in [plan 05](05-accessibility.md).
- **OpenAPI's own keywords**, such as `example`, and formats JSON Schema doesn't define, such as `password`, are registered with the validator, so nothing in the spec is silently skipped.
- **A mismatch** is either a Folio bug or a mistake in the spec. Check Folio's handler first. Report a Folio bug with the mismatch lines; fix a spec mistake in the wiki's copy, then in each framework. Never loosen a schema just to make a test pass.

## Scenarios

| ID | Scenario | Steps | Expected |
|---|---|---|---|
| CON-01 | Token creation matches the contract | `POST /api/tokens` with the member's credentials and `expiresInDays: 1` | 201, no mismatches for `createAccessToken` |
| CON-02 | Token list matches the contract | Create a token, then `GET /api/tokens` with it | 200, no mismatches for `listAccessTokens` |
| CON-03 | Who am I matches the contract | `GET /api/me` with the session cookie, then with a token | 200 both times, no mismatches for `getMe` |
| CON-04 | Shelf lifecycle matches the contract | With a token, create a shelf, rename it and delete it | 201, then 200 and 200, no mismatches for `createShelf` and `changeShelf` |
| CON-05 | Shelf books match the contract | With a token, create a shelf, put *Pride and Prejudice* on it, take it off, then delete the shelf | 200 both times, no mismatches for `setShelfBook` |
| CON-06 | Token revocation matches the contract | Create a token, revoke it with `current`, then `GET /api/me` with it | 200, no mismatches for `revokeAccessToken`; then 401, no mismatches for `getMe` |
| CON-07 | Error answers match the contract | With a token: rename a shelf with an unknown UUID; create a shelf with an unknown field; with a `text/plain` body; with a body over 2 KB; and `GET /api/me` with a foreign `Origin` | 404, 400, 415, 413 and 403, no mismatches for `changeShelf`, `createShelf` and `getMe` |

## Framework notes

- **Where the tests go:** Playwright `tests/contract/`, Cypress `cypress/e2e/contract/`, Selenium a new `tests/contract` package. The plan 04 tests stay as they are.
- **Where the spec goes:** Playwright and Cypress `openapi/folio.yaml`, Selenium `src/test/resources/openapi/folio.yaml`. Each is inside the framework's folder, so its Docker container and CI see it with no change to `compose.yaml`. Playwright and Cypress list `openapi/` in `.prettierignore`, because Prettier would reformat the copy and it must stay identical to the wiki's.
- **Playwright:** Ajv's 2020 build (`ajv/dist/2020`) with `ajv-formats`, and `yaml` to read the spec, as a `contractViolations` fixture in `fixtures/index.ts`.
- **Cypress:** the same three libraries, run in Node as a `contractViolations` task in `cypress.config.js`, so nothing is bundled into the browser (see the `axe-core` note in plan 05). A `cy.contractViolations(operationId, response)` command in `cypress/support/commands.js` sends the response's status, headers and body to the task.
- **Selenium:** networknt's `json-schema-validator`, which supports JSON Schema 2020-12 and uses Jackson 3 like the pom's `jackson-databind`, with `jackson-dataformat-yaml` to read the spec, in `Contract.violations(operationId, response)` in `support/`, which takes a REST Assured `Response`. REST Assured's own `json-schema-validator` isn't used: it supports only JSON Schema draft 4, which has no `const` and no `type: 'null'`.
- **Libraries are added** in the phase that first uses them, at exact versions, like every other dependency. Each framework's `AGENTS.md` gets the libraries and a short "Contract tests" section in that phase.

## Phases

| Phase | Change | Framework | Done |
|---|---|---|---|
| 1 | The spec copy, the libraries, the `contractViolations` fixture, and CON-01 | Playwright | No |
| 2 | The spec copy, the libraries, `cy.contractViolations()`, and CON-01 | Cypress | No |
| 3 | The spec copy, the libraries, `Contract.violations()`, and CON-01 | Selenium | No |
| 4 | CON-02 | Playwright | No |
| 5 | CON-02 | Cypress | No |
| 6 | CON-02 | Selenium | No |
| 7 | CON-03 | Playwright | No |
| 8 | CON-03 | Cypress | No |
| 9 | CON-03 | Selenium | No |
| 10 | CON-04 | Playwright | No |
| 11 | CON-04 | Cypress | No |
| 12 | CON-04 | Selenium | No |
| 13 | CON-05 | Playwright | No |
| 14 | CON-05 | Cypress | No |
| 15 | CON-05 | Selenium | No |
| 16 | CON-06 | Playwright | No |
| 17 | CON-06 | Cypress | No |
| 18 | CON-06 | Selenium | No |
| 19 | CON-07 | Playwright | No |
| 20 | CON-07 | Cypress | No |
| 21 | CON-07 | Selenium | No |
| 22 | Mark row 6 Done in ROADMAP.md, and name the spec and the libraries in its cells | Repository | No |
