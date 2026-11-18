# AGENTS.md

Instructions for AI coding agents working in `selenium-java-framework/`. Humans should start with the [README](README.md). The repository-wide rules in the root [AGENTS.md](../AGENTS.md) also apply.

## Stack

- Selenium 4.53.0 (Java bindings), Java 25, Maven through the wrapper (`./mvnw`)
- JUnit Jupiter 6.1.3 (via `junit-bom`), AssertJ 3.27.7
- Spotless 3.11.0 with google-java-format
- Application under test: Folio at `https://dev.agenticlibrary.app`

## Commands

Run from this folder.

| Task | Command |
|---|---|
| All tests | `./mvnw test` |
| One test class | `./mvnw test -Dtest=SmokeTest` |
| One test method | `./mvnw test -Dtest=SmokeTest#homePageLoads` |
| Run in Firefox | `./mvnw test -DbrowserName=firefox` |
| Show the browser | `./mvnw test -Dheadless=false` |
| Format code | `./mvnw spotless:apply` |
| Check formatting | `./mvnw spotless:check` |

Before you finish a change, run `./mvnw spotless:apply` and the tests you touched.

## Native and Docker runs

- **Native** (the commands above): for interactive and agent work, such as running with `-Dheadless=false`.
- **Docker**: for full-suite runs, locally and in CI, using the same image. `docker compose run --rm --build tests` runs `./mvnw test`; arguments after `tests` go to Maven, for example `docker compose run --rm --build tests -DbrowserName=firefox`.
  - The image is built from `Dockerfile` on `eclipse-temurin:25-jdk-noble`, with Google Chrome and Firefox from their vendors' apt repositories and the Maven dependencies included. Browser versions are the latest stable at build time.
  - The image sets `NO_SANDBOX=true`, which adds `--no-sandbox` for Chromium, because Docker blocks the namespaces Chrome's sandbox needs. Never turn on `noSandbox` outside containers.
  - `compose.yaml` mounts this folder into the container, so test edits need no rebuild and reports land in `target/` as usual. Rebuild after changing `pom.xml` (`--build` does that).
  - The container runs as your host user (`HOST_UID`/`HOST_GID`, default `1000`).
  - Never run `docker compose config`: Compose reads `.env` and prints the credentials.

## Layout

```
src/test/java/com/testautomationhub/selenium/
├── support/   # Config (settings lookup), DriverFactory (creates the WebDriver)
├── pages/     # page objects
└── tests/
    └── e2e/   # browser end-to-end tests
src/test/resources/config.properties   # default settings
```

## Configuration and credentials

`Config.get(key)` looks a key up in this order: system property (`-DbaseUrl=...`), environment variable in upper snake case (`BASE_URL`), `.env` in this folder, then `config.properties`.

Settings: `baseUrl`, `browserName` (`chromium` or `firefox`), `headless`, `noSandbox` (containers only), `adminUsername`, `adminPassword`, `memberUsername`, `memberPassword`.

- Credentials live only in `.env`, which is gitignored. `.env.example` lists the keys with empty values.
- Never hardcode, log, print or commit credentials, and never copy them into test names, assertions, reports or screenshots.
- Don't open or print `.env`. Read values through `Config`.
- Every setting can be overridden by an environment variable of the same name in upper snake case, so never name a setting after a common variable such as `BROWSER`, `HOME`, `PATH` or `DISPLAY`. Desktops set `BROWSER`, which is why the browser setting is `browserName`.

## Browsers

Only Chromium and Firefox. Don't add Edge, Safari or WebKit. `chromium` uses `ChromeDriver`; Selenium Manager finds the installed Chrome or downloads Chrome for Testing.

## Selenium documentation

- Start here: https://www.selenium.dev/llms.txt
- Documentation: https://www.selenium.dev/documentation/
- Examples: https://github.com/SeleniumHQ/seleniumhq.github.io/tree/trunk/examples
- Java API: https://seleniumhq.github.io/selenium/docs/api/java/index.html
- Java changelog: https://github.com/SeleniumHQ/selenium/blob/trunk/java/CHANGELOG
- Outdated patterns to avoid: https://www.selenium.dev/documentation/ai_agents/outdated_patterns/

Fetch the relevant documentation page before using a Selenium API you aren't certain about. If an API isn't in the current documentation or API reference, it doesn't exist.

## Selenium rules

Adapted from Selenium's own guidance for AI agents.

- Use only Selenium 4 APIs. Don't base new code on legacy or CDP pages.
- Selenium Manager handles drivers. Don't add WebDriverManager, download drivers, set `webdriver.chrome.driver`, or pass a driver path.
- Use the browser's `Options` class, not `DesiredCapabilities` or raw capability maps. `merge` returns a new object, so assign the result.
- Headless is an argument (`--headless=new` for Chromium, `-headless` for Firefox). `setHeadless` was removed.
- Timeouts and waits take a `java.time.Duration`.
- Never use `Thread.sleep`. Use an explicit wait for the condition the next line depends on. Don't mix implicit and explicit waits. When a test is flaky, find the condition that wasn't true yet instead of raising timeouts.
- Locate with `driver.findElement(By...)`; the `findElementBy*` helpers were removed. Prefer id and name, then CSS on a stable attribute. No absolute XPath or generated class names. Declare locators separately from actions.
- One fresh driver per test. End it with `quit()` in teardown, not `close()`. Don't share drivers between tests.
- For console logs, JavaScript errors and network interception, use WebDriver BiDi, not CDP.

## Agent tooling

- This framework has no MCP server or agent skills. The instructions in this file follow Selenium's own guidance for AI agents. Don't add an MCP server without asking.
- Check locators against the real page by running a test with `-Dheadless=false`, or with a throwaway test you delete afterwards.
