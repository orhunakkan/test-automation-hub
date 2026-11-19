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
│   └── ui/          # browser end-to-end specs (*.cy.js)
├── fixtures/        # static test data
├── pages/           # page objects
└── support/
    ├── e2e.js       # loaded before every spec
    └── commands.js  # custom commands
cypress.config.js
```

## Locators

Follow Cypress's [selector best practices](https://docs.cypress.io/app/core-concepts/best-practices#Selecting-Elements), mixed:

- Use [`cy.getByRole`](https://on.cypress.io/getbyrole) with the element's accessible name when it has a role, such as `cy.getByRole('button', { name: 'Sign in' })`. A string name must match the whole name. Some elements have no role, such as a password input or a `<summary>`.
- Use `cy.contains` when the visible text is what the test checks and no role fits.
- Otherwise use `cy.get('[data-testid=…]')`. Folio's test attribute is `data-testid`, shared with the Playwright and Selenium frameworks. When the element has none yet, add it to Folio's source.
- `cy.get` with anything but a `data-*` selector is a lint error (`cypress/require-data-selectors`), and so is XPath (`cypress/no-xpath`).
- Page objects hold locators and actions; assertions belong in the specs.

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

## Ignored React error #418

Cypress injects a script into every page it loads. Folio renders the whole document on the server, so React treats that script as a hydration mismatch, reports React error #418 and rebuilds the page in the browser. The page works, and plain browsers load it without errors. `cypress/support/e2e.js` therefore ignores this one error, matched by its message. Every other uncaught application error still fails the test.

- Don't widen that handler, and don't add other `uncaught:exception` handlers that ignore errors, without asking.
- Known Cypress issue: https://github.com/cypress-io/cypress/issues/27204

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
