# Cypress JavaScript framework

Browser tests for Folio (`https://dev.agenticlibrary.app`) with Cypress 16.3.0 and plain JavaScript.

## Prerequisites

- Node.js 22, 24 or 26+
- Chromium and Firefox installed on the system
- Or only Docker, for full-suite runs (see [In Docker](#in-docker))

## Setup

```sh
npm install
cp .env.example .env   # then fill in the test users
```

`.env` is gitignored. Never commit it.

## Running tests

```sh
npm test                 # all specs in Chromium
npm run test:firefox     # all specs in Firefox
npm run open             # open the Cypress app
npx cypress run --browser chromium --spec cypress/e2e/ui/smoke.cy.js   # one spec
```

From a VS Code terminal, prefix commands with `env -u ELECTRON_RUN_AS_NODE`. Otherwise Cypress fails to start with `bad option: --no-sandbox`.

### In Docker

Full-suite runs, locally and in CI, use the same Docker image, built from `Dockerfile` on Cypress's official `cypress/included:16.3.0` image. Only Docker is needed; no local Node.js or browsers. The image has Google Chrome and Firefox, so Docker runs use Chrome instead of Chromium.

```sh
docker compose run --rm --build tests                     # all specs in Chrome
docker compose run --rm --build tests --browser firefox   # arguments go to cypress run
```

The folder is mounted into the container, so screenshots land in `cypress/screenshots/` as usual. The container runs as user id 1000; if yours differs, set `HOST_UID=$(id -u) HOST_GID=$(id -g)`. Use native runs for `cypress open` and agent work.

## Settings

`cypress.config.js` reads these from the environment or from `.env`:

| Variable                             | Default                          |
| ------------------------------------ | -------------------------------- |
| `BASE_URL`                           | `https://dev.agenticlibrary.app` |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`   | none                             |
| `MEMBER_USERNAME`, `MEMBER_PASSWORD` | none                             |

Specs read the credentials with `cy.env()`.

## Layout

```
cypress/
├── e2e/ui/      # end-to-end specs
├── fixtures/    # static test data
├── pages/       # page objects
└── support/     # e2e.js, commands.js
```

## Code quality

```sh
npm run lint
npm run format        # or format:check
```

## Ignored React error #418

Cypress injects a script into every page, which makes React report a hydration mismatch (error #418) on Folio's server-rendered pages. The page still works, and plain browsers don't show the error. `cypress/support/e2e.js` ignores only this error; any other uncaught application error still fails the test. See [cypress-io/cypress#27204](https://github.com/cypress-io/cypress/issues/27204).

## Working with AI agents

Start your agent session inside this folder so it picks up the tooling installed here. Instructions for agents are in [AGENTS.md](AGENTS.md).

- Cypress AI skills from `cypress-io/ai-toolkit`: `cypress-author`, `cypress-explain`, `cypress-tap` and `cypress-docs`, pinned in `skills-lock.json`.
- `cypress tap`, built into Cypress, lets the agent run and inspect specs in a live `cypress open` session.

Update the skills with `DISABLE_TELEMETRY=1 npx skills update`.
