# AGENTS.md

Instructions for AI coding agents working in `selenium-java-framework/`. Humans should start with the [README](README.md). The repository-wide rules in the root [AGENTS.md](../AGENTS.md) also apply.

## Stack

- Selenium 4.53.0 (Java bindings), Java 25, Maven through the wrapper (`./mvnw`)
- JUnit Jupiter 6.1.3 (via `junit-bom`), AssertJ 3.27.7
- REST Assured 6.3.0, for the HTTP API tests, with Jackson 3.3.0 (`jackson-databind`) so request bodies can be Java maps
- Spotless 3.11.0 with google-java-format
- Checkstyle 14.4.0 (maven-checkstyle-plugin 3.6.0), for the locator rule only
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
| Check locators | `./mvnw checkstyle:check` |

Before you finish a change, run `./mvnw spotless:apply` and the tests you touched.

## Native and Docker runs

- **Native** (the commands above): for interactive and agent work, such as running with `-Dheadless=false`.
- **Docker**: for full-suite runs, locally and in CI, using the same image. `docker compose run --rm --build tests` runs `./mvnw test`; arguments after `tests` go to Maven, for example `docker compose run --rm --build tests -DbrowserName=firefox`.
  - The image is built from `Dockerfile` on `eclipse-temurin:25-jdk-noble`, with Google Chrome and Firefox from their vendors' apt repositories and the Maven dependencies included. Browser versions are the latest stable at build time.
  - The image sets `NO_SANDBOX=true`, which adds `--no-sandbox` for Chromium, because Docker blocks the namespaces Chrome's sandbox needs. Never turn on `noSandbox` outside containers.
  - `compose.yaml` mounts this folder into the container, so test edits need no rebuild and reports land in `target/` as usual. Rebuild after changing `pom.xml` (`--build` does that).
  - The container runs as your host user (`HOST_UID`/`HOST_GID`, default `1000`).
  - Never run `docker compose config`: Compose reads `.env` and prints the credentials.

## CI

`.github/workflows/selenium.yml` (at the repository root) runs the Docker suite on the self-hosted runner, once with `-DbrowserName=chromium` and once with `-DbrowserName=firefox`, on pushes to `main` that change this folder. A failed run attaches `target/surefire-reports/`.

## Layout

```
src/test/java/com/testautomationhub/selenium/
├── support/   # Config (settings lookup), DriverFactory (creates the WebDriver), BrowserTest (base class: a fresh driver per test), SignIn (API sign-in), AccessToken (bearer tokens for API tests)
├── pages/     # page objects
└── tests/
    ├── api/   # HTTP API tests, with REST Assured and no browser
    └── e2e/   # browser end-to-end tests
src/test/resources/config.properties   # default settings
```

## Signing in

Follows Selenium's [Generating application state](https://www.selenium.dev/documentation/test_practices/encouraged/generating_application_state/): don't sign in through the browser before every test; "use an API to login and set a cookie". Tests start signed out.

- **`SignIn.as(driver, "member")` or `"admin"`** (`support/SignIn.java`): posts the user's credentials to `/login` with Java's `HttpClient`, sending the `Origin` header Folio requires. It reads the `__Host-session` cookie from the response, opens `/robots.txt` to be on Folio's domain, and adds the cookie to the browser. It throws if Folio doesn't redirect to `/library`. API tests that need a session cookie without a browser call `SignIn.sessionCookie("member")`, which is the same request without the browser step.
- **A fresh session per test,** with no cached sessions, following Selenium's [Avoid sharing state](https://www.selenium.dev/documentation/test_practices/encouraged/avoid_sharing_state/) and one new driver per test. A test that signs out ends only its own session.
- Only the sign-in tests (`SignInTest`) go through the form, because the form is what they test.
- **Access tokens (API tests only):** Folio also accepts `Authorization: Bearer <token>` on `/api/me`, the `/api/tokens` endpoints and the shelves endpoints. `AccessToken.create("member")` (`support/AccessToken.java`) gets one from `POST /api/tokens` with REST Assured (a `Map` body of `username`, `password`, `name`, `expiresInDays: 1`; no `Origin` needed) and throws if that fails. A test sends it with `.auth().oauth2(token)` and calls `AccessToken.revoke(token)` in `@AfterEach`. Only `TokensTest` calls `POST /api/tokens` itself, because creating is what it tests. Build JSON bodies that hold credentials from a `Map`, never by joining strings, so any character in a password is escaped. An account can have only 10 live tokens, so a token that isn't revoked holds a slot until it expires.

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
- Locate with `driver.findElement(By...)`; the `findElementBy*` helpers were removed. Locate every element by its `data-testid`, as CSS on a stable attribute: `By.cssSelector("[data-testid=sign-in]")`. Folio gives every element a test touches one (see its `docs/conventions.md`, "Test ids"). Repeated items carry their key in `data-key` (`[data-testid=book-card][data-key=pride-and-prejudice]`), and a component Folio renders twice keeps one id, so pick the displayed one. Declare locators separately from actions.
- Checkstyle enforces it: any `By` locator other than `By.cssSelector("[data-testid=…]")`, written in place, fails the build. The rule is in `checkstyle.xml`, and the check runs in Maven's `validate` phase, so `./mvnw test` and CI run it too.
- Page objects hold locators and actions; assertions belong in the tests.
- One fresh driver per test. End it with `quit()` in teardown, not `close()`. Don't share drivers between tests.
- For console logs, JavaScript errors and network interception, use WebDriver BiDi, not CDP.

## Agent tooling

- This framework has no MCP server or agent skills. The instructions in this file follow Selenium's own guidance for AI agents. Don't add an MCP server without asking.
- Check locators against the real page by running a test with `-Dheadless=false`, or with a throwaway test you delete afterwards.
