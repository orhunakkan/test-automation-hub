# Selenium Java framework

Browser tests for Folio (`https://dev.agenticlibrary.app`) with Selenium 4.53.0, Java 25, JUnit and AssertJ.

## Prerequisites

- Java 25
- Chromium or Chrome, and Firefox. If no Chrome is installed, Selenium Manager downloads Chrome for Testing on the first run.

Maven doesn't need to be installed: the `./mvnw` wrapper downloads the pinned version. For full-suite runs you can use only Docker instead (see [In Docker](#in-docker)).

## Setup

```sh
cp .env.example .env   # then fill in the test users
```

`.env` is gitignored. Never commit it.

## Running tests

```sh
./mvnw test                                   # all tests, headless Chromium
./mvnw test -Dtest=SmokeTest                  # one class
./mvnw test -DbrowserName=firefox             # Firefox
./mvnw test -Dheadless=false                  # show the browser
```

Results are in `target/surefire-reports/`.

### In Docker

Full-suite runs, locally and in CI, use the same Docker image, built from `Dockerfile`: Java 25, Google Chrome, Firefox and the Maven dependencies. Only Docker is needed; no local Java or browsers.

```sh
docker compose run --rm --build tests                         # all tests, headless Chromium
docker compose run --rm --build tests -DbrowserName=firefox   # arguments go to Maven
```

The folder is mounted into the container, so results land in `target/surefire-reports/` as usual. The container runs as user id 1000; if yours differs, set `HOST_UID=$(id -u) HOST_GID=$(id -g)`. Use native runs for `-Dheadless=false` and agent work.

## Settings

Defaults are in `src/test/resources/config.properties`. Override any setting with a system property (`-DbaseUrl=...`), an environment variable (`BASE_URL=...`) or `.env`, in that order of priority.

| Setting | Environment variable | Default |
|---|---|---|
| `baseUrl` | `BASE_URL` | `https://dev.agenticlibrary.app` |
| `browserName` | `BROWSER_NAME` | `chromium` (or `firefox`) |
| `headless` | `HEADLESS` | `true` |
| `noSandbox` | `NO_SANDBOX` | `false`; the Docker image sets `true` |
| `adminUsername`, `adminPassword` | `ADMIN_USERNAME`, `ADMIN_PASSWORD` | none |
| `memberUsername`, `memberPassword` | `MEMBER_USERNAME`, `MEMBER_PASSWORD` | none |

## Layout

```
src/test/java/com/testautomationhub/selenium/
├── support/   # Config, DriverFactory
├── pages/     # page objects
└── tests/e2e/ # end-to-end tests
```

## Formatting

```sh
./mvnw spotless:apply   # format
./mvnw spotless:check   # verify
```

## Working with AI agents

Start your agent session inside this folder so it picks up this folder's [AGENTS.md](AGENTS.md). It follows Selenium's guidance for AI agents. This framework has no MCP server or agent skills.
