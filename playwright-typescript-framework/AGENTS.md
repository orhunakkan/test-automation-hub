# AGENTS.md

Instructions for AI coding agents working in `playwright-typescript-framework/`. Humans should start with the [README](README.md). The repository-wide rules in the root [AGENTS.md](../AGENTS.md) also apply.

## Stack

- Playwright Test 1.65.1, TypeScript 6.0.3, Node.js 22 or later
- ESLint 10 with `typescript-eslint` and `eslint-plugin-playwright`, Prettier 3
- Built-in HTML reporter
- Application under test: Folio at `https://dev.agenticlibrary.app`

TypeScript stays on 6.0.x: `typescript-eslint` 8.73 doesn't support TypeScript 7 yet.

## Accepted audit finding

`npm audit` reports a high-severity ReDoS in `picomatch` (GHSA-fc5q-39xc-vjpf), reached through `typescript-eslint` → `tinyglobby`. It's accepted for now (checked 18 November 2026):

- No fixed version exists. Every `picomatch` release up to the latest, 4.0.7, is affected, and the fix pull requests upstream aren't merged yet.
- npm's suggested fix, `npm audit fix --force`, downgrades `typescript-eslint` to 8.47.0, which doesn't support TypeScript 6. Don't run it.
- It isn't exploitable here. `picomatch` is a lint-time dependency only; typescript-eslint uses it only to expand `parserOptions.project` globs, which this config doesn't set; and it never receives untrusted patterns.

When a `picomatch` release above 4.0.7 fixes the advisory, update it (`npm update picomatch`, or an `overrides` entry if `tinyglobby` pins an older range), confirm `npm audit` is clean, and remove this section.

## Commands

Run from this folder.

| Task                      | Command                                           |
| ------------------------- | ------------------------------------------------- |
| All tests, both browsers  | `npm test`                                        |
| One browser               | `npm run test:chromium` or `npm run test:firefox` |
| One file                  | `npx playwright test tests/e2e/smoke.spec.ts`     |
| One test by title         | `npx playwright test -g "home page loads"`        |
| Show the browser          | `npm run test:headed`                             |
| Open the last report      | `npm run report`                                  |
| Type check                | `npm run typecheck`                               |
| Lint                      | `npm run lint`                                    |
| Format / check formatting | `npm run format` / `npm run format:check`         |

Before you finish a change, run `typecheck`, `lint`, `format:check` and the tests you touched.

## Native and Docker runs

- **Native** (the commands above): for interactive and agent work, such as headed runs, UI mode and `playwright-cli`.
- **Docker**: for full-suite runs, locally and in CI, using the same image. `docker compose run --rm --build tests` runs the whole suite; arguments after `tests` go to `playwright test`, for example `docker compose run --rm --build tests --project=firefox`.
  - The image is built from `Dockerfile` on `mcr.microsoft.com/playwright:v1.65.1-noble`. When you upgrade `@playwright/test`, change the image tag to the same version.
  - `compose.yaml` mounts this folder into the container, so test edits need no rebuild and reports land in the usual folders. `node_modules` comes from the image; rebuild after changing dependencies (`--build` does that).
  - The container runs as your host user (`HOST_UID`/`HOST_GID`, default `1000`).
  - Never run `docker compose config`: Compose reads `.env` and prints the credentials.

## CI

`.github/workflows/playwright.yml` (at the repository root) runs the Docker suite on the self-hosted runner, once with `--project=chromium` and once with `--project=firefox`, on pushes to `main` that change this folder. `CI=true` is passed into the container, so the config's CI settings apply. A failed run attaches `playwright-report/` and `test-results/`.

## Layout

```
fixtures/index.ts    # exports `test`, `expect`, the `member` and `admin` users and the `signIn` fixture
pages/               # page objects
tests/
├── auth.setup.ts    # the `setup` project: saves each user's signed-in session
├── seed.spec.ts     # seed test used by the Playwright planner agent
├── api/             # HTTP API tests
└── e2e/             # browser end-to-end tests
specs/               # Markdown test plans written by the planner agent
playwright.config.ts
```

- Locators follow Playwright's [recommended order](https://playwright.dev/docs/locators#quick-guide): `getByRole`, `getByLabel`, `getByText` and the other `getBy*` methods, with `getByTestId` last. `page.locator()` with a CSS or XPath string is a lint error (`playwright/no-raw-locators`). Folio gives every element a test touches a `data-testid` (see its `docs/conventions.md`, "Test ids"), so `getByTestId` is always there when no role, label or text fits.
- Page objects hold locators and actions; assertions belong in the tests.
- Import `test` and `expect` from `fixtures/index.js`, not from `@playwright/test`. The `.js` extension is required because the project uses `NodeNext` module resolution.
- `tests/seed.spec.ts` has no assertions on purpose, so the `playwright/expect-expect` lint warning on it is expected.

## Signing in

Follows Playwright's [Authentication](https://playwright.dev/docs/auth) guide. Tests start signed out.

- **Saved sessions:** the `setup` project (`tests/auth.setup.ts`) runs before `chromium` and `firefox`. It signs the member and the admin in once each and saves their sessions to `playwright/.auth/member.json` and `admin.json`. A test that only needs to be signed in opts in with `test.use({ storageState: member.authFile })`.
- **`signIn(user)` fixture:** signs a user in with a `POST /login` request, not the form, into the test's own browser context. It sends the `Origin` header Folio requires, and throws if Folio doesn't redirect to `/library`.
- **Tests that end the session**, such as signing out or changing the password, call `signIn` for a session of their own. Folio deletes the session on sign-out, so a saved session would stop working for every other test in the run.
- Only the sign-in tests (`tests/e2e/sign-in.spec.ts`) go through the form, because the form is what they test.
- **Access tokens (API tests only):** Folio also accepts `Authorization: Bearer <token>` on `/api/me`, the `/api/tokens` endpoints and the shelves endpoints. A test gets one from `POST /api/tokens` (JSON `username`, `password`, `name`, `expiresInDays: 1`; no `Origin` needed), sends it in `headers` on each request, and revokes it in `test.afterEach` with `POST /api/tokens/current` and `{ "intent": "revoke" }`. An account can have only 10 live tokens, so a token that isn't revoked holds a slot until it expires.

## Configuration and credentials

`playwright.config.ts` loads `.env` from this folder when it exists. Variables: `BASE_URL` (default `https://dev.agenticlibrary.app`), `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `MEMBER_USERNAME`, `MEMBER_PASSWORD`.

- Credentials live only in `.env`, which is gitignored. `.env.example` lists the variables with empty values.
- Read credentials from `process.env`. Never hardcode, log, print or commit them, and never put them in test titles or annotations.
- Don't open or print `.env`.
- Traces, videos and reports can contain typed values. `test-results/`, `playwright-report/`, `blob-report/` and `playwright/.auth/` are gitignored; keep it that way.

## Browsers

Only the `chromium` and `firefox` projects. Don't add WebKit, Edge or branded-Chrome projects.

## Playwright documentation

- Documentation: https://playwright.dev/docs/intro
- API reference: https://playwright.dev/docs/api/class-playwright
- Test agents: https://playwright.dev/docs/test-agents
- CLI for agents: https://playwright.dev/agent-cli/introduction

Check the documentation before using an API you aren't certain exists in Playwright 1.65.

## Agent tooling

Installed in this folder. It loads when the agent session starts in this folder.

- **`playwright-cli` skill** (`.claude/skills/playwright-cli/`): drive a real browser from the terminal with `npx playwright cli ...` to inspect pages and check locators. Its browser settings are in `.playwright/cli.config.json`.
- **Test agents** (`.claude/agents/`): `playwright-test-planner` (explores the app, writes a plan to `specs/`), `playwright-test-generator` (turns a plan into tests) and `playwright-test-healer` (runs failing tests and repairs them). They use the `playwright-test` MCP server in `.mcp.json`.

Generated files: don't edit `.claude/agents/`, `.claude/skills/playwright-cli/` or `.mcp.json` by hand. After upgrading Playwright, regenerate them:

```sh
npx playwright init-agents --loop=claude --project=chromium
npx playwright cli install --skills
```
