# Playwright TypeScript framework

Browser tests for Folio (`https://dev.agenticlibrary.app`) with Playwright Test 1.65.1 and TypeScript.

## Prerequisites

- Node.js 22 or later
- Or only Docker, for full-suite runs (see [In Docker](#in-docker))

## Setup

```sh
npm install
npx playwright install chromium firefox
cp .env.example .env   # then fill in the test users
```

`.env` is gitignored. Never commit it.

## Running tests

```sh
npm test                                     # Chromium and Firefox
npm run test:chromium                        # one browser
npx playwright test tests/e2e/smoke.spec.ts  # one file
npm run test:headed                          # show the browser
npm run report                               # open the HTML report
```

### In Docker

Full-suite runs, locally and in CI, use the same Docker image, built from `Dockerfile` on Playwright's official 1.65.1 image. Only Docker is needed; no local Node.js or browsers.

```sh
docker compose run --rm --build tests                     # Chromium and Firefox
docker compose run --rm --build tests --project=firefox   # arguments go to playwright test
```

The folder is mounted into the container, so reports land in `playwright-report/` as usual. The container runs as user id 1000; if yours differs, set `HOST_UID=$(id -u) HOST_GID=$(id -g)`. Use native runs for headed mode, UI mode and agent work.

## Settings

`playwright.config.ts` reads these from the environment or from `.env`:

| Variable                             | Default                          |
| ------------------------------------ | -------------------------------- |
| `BASE_URL`                           | `https://dev.agenticlibrary.app` |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`   | none                             |
| `MEMBER_USERNAME`, `MEMBER_PASSWORD` | none                             |

## Layout

```
fixtures/   # custom fixtures; tests import test and expect from here
pages/      # page objects
tests/      # seed.spec.ts, and e2e/ for end-to-end tests
specs/      # test plans written by the planner agent
```

## Code quality

```sh
npm run typecheck
npm run lint
npm run format        # or format:check
```

## Known audit finding

`npm audit` reports a high-severity issue in `picomatch` ([GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf)), which comes in through the lint tools. No fixed version is released yet, it isn't reachable from how this project uses those tools, and npm's suggested `audit fix --force` would break TypeScript support, so don't run it. Details are in [AGENTS.md](AGENTS.md#accepted-audit-finding).

## Working with AI agents

Start your agent session inside this folder so it picks up the tooling installed here. Instructions for agents are in [AGENTS.md](AGENTS.md).

- `playwright-cli` skill: lets the agent drive a real browser from the terminal.
- Playwright test agents: planner, generator and healer, in `.claude/agents/`. They use the MCP server defined in `.mcp.json`; Claude Code asks you to approve it the first time.

After upgrading Playwright, regenerate both:

```sh
npx playwright init-agents --loop=claude --project=chromium
npx playwright cli install --skills
```
