# AGENTS.md

Instructions for AI coding agents working in `cypress-javascript-framework/`. Humans should start with the [README](README.md). The repository-wide rules in the root [AGENTS.md](../AGENTS.md) also apply.

## Stack

- Cypress 16.3.0, plain JavaScript (ES modules, no TypeScript), Node.js 22, 24 or 26+
- ESLint 10 with `eslint-plugin-cypress`, Prettier 3
- Built-in spec reporter, screenshots and videos
- Application under test: Folio at `https://dev.agenticlibrary.app`

## Commands

Run from this folder.

| Task                      | Command                                                                |
| ------------------------- | ---------------------------------------------------------------------- |
| All specs in Chromium     | `npm test`                                                             |
| All specs in Firefox      | `npm run test:firefox`                                                 |
| One spec                  | `npx cypress run --browser chromium --spec cypress/e2e/ui/smoke.cy.js` |
| Open the Cypress app      | `npm run open`                                                         |
| Lint                      | `npm run lint`                                                         |
| Format / check formatting | `npm run format` / `npm run format:check`                              |

Before you finish a change, run `lint`, `format:check` and the specs you touched.

In a VS Code terminal, Cypress fails to start with `bad option: --no-sandbox` because VS Code sets `ELECTRON_RUN_AS_NODE=1`. Prefix native commands with `env -u ELECTRON_RUN_AS_NODE`.

## Native and Docker runs

- **Native** (the commands above): for interactive and agent work, such as `cypress open` and `cypress tap`.
- **Docker**: for full-suite runs, locally and in CI, using the same image. `docker compose run --rm --build tests` runs all specs in Chrome; arguments after `tests` go to `cypress run`, for example `docker compose run --rm --build tests --browser firefox`.
  - The image is built from `Dockerfile` on `cypress/included:16.3.0`, which includes Google Chrome and Firefox but not Chromium, so Docker runs use `--browser chrome`. When you upgrade `cypress`, change the image tag to the same version.
  - `compose.yaml` mounts this folder into the container, so spec edits need no rebuild and screenshots land in the usual folders. `node_modules` comes from the image; rebuild after changing dependencies (`--build` does that).
  - The container runs as your host user (`HOST_UID`/`HOST_GID`, default `1000`).
  - Never run `docker compose config`: Compose reads `.env` and prints the credentials.

## CI

`.github/workflows/cypress.yml` (at the repository root) runs the Docker suite on the self-hosted runner, once with `--browser chrome` and once with `--browser firefox`, on pushes to `main` that change this folder. A failed run attaches `cypress/screenshots/`.

## Layout

```
cypress/
├── e2e/
│   ├── api/         # HTTP API specs (*.cy.js)
│   └── ui/          # browser end-to-end specs (*.cy.js)
├── fixtures/        # static test data
├── pages/           # page objects
└── support/
    ├── e2e.js       # loaded before every spec
    └── commands.js  # custom commands
cypress.config.js
```

## Locators

Locate every element with `cy.get('[data-testid=…]')`. Cypress's [selector best practices](https://docs.cypress.io/app/core-concepts/best-practices#Selecting-Elements) rate data attributes "Always", above `cy.contains` and `cy.getByRole` ("Depends"), and Folio gives every element a test touches a `data-testid` (see its `docs/conventions.md`, "Test ids"):

- Repeated items share one id and carry their key in `data-key`: `cy.get('[data-testid=book-card][data-key=pride-and-prejudice]')`.
- A component Folio renders twice, such as `account-menu` in the sidebar and the phone-width top bar, keeps one id; add `.filter(':visible')`.
- Check text in the spec with an assertion, such as `.should('have.text', 'Library')`, not in the locator.
- Lint enforces it: `cy.get` takes only a `data-testid` selector or an `@alias`, and `cy.contains`, `cy.getByRole` and XPath are errors.
- Page objects hold locators and actions; assertions belong in the specs.

## Signing in

Follows Cypress's [best practices](https://docs.cypress.io/app/core-concepts/best-practices): sign in programmatically and reuse the session with [`cy.session`](https://on.cypress.io/session). Tests start signed out.

- **`cy.signIn('member')` or `cy.signIn('admin')`** (`cypress/support/commands.js`): signs the user in with a `POST /login` request, not the form, sending the `Origin` header Folio requires. It throws if Folio doesn't redirect to `/library`.
- **One cached session per user**, shared across specs (`cacheAcrossSpecs`). Its `validate` requests `/account`, which returns 200 only when signed in. Folio deletes the session on sign-out, so after a test signs out, the next `cy.signIn` for that user finds the cached session dead and signs in again.
- `cy.session` clears the page, so `cy.visit` after `cy.signIn`.
- Only the sign-in tests (`cypress/e2e/ui/sign-in.cy.js`) go through the form, because the form is what they test.
- **Access tokens (API specs only):** Folio also accepts `Authorization: Bearer <token>` on `/api/me`, the `/api/tokens` endpoints and the shelves endpoints. `cy.createToken('member')` (`cypress/support/commands.js`) yields a token from `POST /api/tokens` (JSON `username`, `password`, `name`, `expiresInDays: 1`; no `Origin` needed, `log: false`) and throws if that fails. A spec sends it in `headers` on each `cy.request` and calls `cy.revokeToken(token)` in `afterEach`. Only the token-creation spec (`cypress/e2e/api/tokens.cy.js`) calls `POST /api/tokens` itself, because creating is what it tests. Unlike the cookie, `cy.request` doesn't send it on its own. An account can have only 10 live tokens, so a token that isn't revoked holds a slot until it expires.

## Configuration and credentials

`cypress.config.js` loads `.env` from this folder when it exists. `BASE_URL` sets `baseUrl` (default `https://dev.agenticlibrary.app`). The credentials go into the config's `env` block: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `MEMBER_USERNAME`, `MEMBER_PASSWORD`.

- Read credentials in specs with `cy.env(['ADMIN_USERNAME', 'ADMIN_PASSWORD'])`. `Cypress.env()` no longer exists in Cypress 16.
- Never put credentials in `expose`. Exposed values are public and reach the browser.
- Type passwords with `{ log: false }` so they stay out of the Command Log.
- Credentials live only in `.env`, which is gitignored. `.env.example` lists the variables with empty values. Never hardcode, log, print or commit them.
- Don't open or print `.env`.
- Screenshots, videos and downloads are gitignored; keep it that way.

## Browsers

Native runs use the system's Chromium and Firefox; Docker runs use the image's Google Chrome and Firefox. Always pass `--browser` (`chromium` natively, `chrome` in Docker, or `firefox`). Don't use Electron, Edge or WebKit.

## Mobile devices

The mobile layout specs (`cypress/e2e/ui/mobile.cy.js`) set only the viewports of the Pixel 10 Pro (427 × 876), the Galaxy Tab S9 (640 × 1024) and the Galaxy Tab S9 in landscape (1024 × 640), with `cy.viewport`. They run in Chromium-family browsers only (Chromium natively, Chrome in Docker): each `describe` sets `{ browser: { family: 'chromium' } }`, so Firefox runs skip them. Cypress has no device emulation, so the user agent, pixel ratio and touch stay the desktop browser's; Folio's layout depends only on width. Don't add other devices or sizes.

## Ignored React error #418

Cypress injects a script into every page it loads. Folio renders the whole document on the server, so React treats that script as a hydration mismatch, reports React error #418 and rebuilds the page in the browser. The page works, and plain browsers load it without errors. `cypress/support/e2e.js` therefore ignores this one error, matched by its message. Every other uncaught application error still fails the test.

- Don't widen that handler, and don't add other `uncaught:exception` handlers that ignore errors, without asking.
- Known Cypress issue: https://github.com/cypress-io/cypress/issues/27204

## Blocked service worker

Folio registers an offline service worker (`public/sw.js` in its repository). Cypress keeps one browser open across tests and its cleanup between them doesn't remove service workers, so the worker one test registers handles the next test's page loads. Under Cypress those loads fail: the worker answers with Folio's offline page, or the page never fires its `load` event. Playwright and Selenium start every test in a fresh browser, so they never meet this.

`cypress/support/e2e.js` therefore removes `navigator.serviceWorker` before every page loads, and Folio skips registering its worker when the browser has none. Cypress tests Folio without offline support; test offline features in Playwright or Selenium.

- Don't remove this handler without checking the full suite in both browsers, several runs in a row.

## Cypress documentation

- Start here: https://docs.cypress.io/llms.txt
- Documentation: https://docs.cypress.io
- API reference: https://docs.cypress.io/api/table-of-contents

Check the documentation before using an API you aren't certain exists in Cypress 16.

## Agent tooling

Installed in this folder. It loads when the agent session starts in this folder.

- **Cypress AI skills** (`.claude/skills/`), from `cypress-io/ai-toolkit` and pinned in `skills-lock.json`:
  - `cypress-author`: write, update and fix specs
  - `cypress-explain`: explain and review specs
  - `cypress-tap`: run and inspect specs in a live session
  - `cypress-docs`: look up Cypress documentation
- **`cypress tap`**: built into Cypress. Start `npx cypress open --e2e --browser chromium` in one terminal, then use `npx cypress tap ...` with `--json` from another. It works only with `cypress open` and Chromium-family browsers.

`cypress-cloud-cli` and Cloud MCP are left out on purpose: this repository uses no Cypress Cloud features.

Don't edit the installed skills by hand. Update them with:

```sh
DISABLE_TELEMETRY=1 npx skills update
```
