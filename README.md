# test-automation-hub

Test automation frameworks for the same web application, one per tool and language. Each framework covers as many kinds of testing as its tool supports, not only UI end-to-end tests, and each is set up for working with AI coding agents.

## Frameworks

| Framework | Tool | Language | Runner and assertions |
|---|---|---|---|
| [selenium-java-framework](selenium-java-framework/) | Selenium 4.53.0 | Java 25 | JUnit 6, AssertJ |
| [playwright-typescript-framework](playwright-typescript-framework/) | Playwright 1.65.1 | TypeScript 6.0 | Playwright Test |
| [cypress-javascript-framework](cypress-javascript-framework/) | Cypress 16.3.0 | JavaScript | Cypress (bundled Mocha and Chai) |

Each framework is self-contained, with its own dependencies, configuration, Docker image and README. They share no code.

[CAPABILITIES.md](CAPABILITIES.md) compares what the three tools can test, layer by layer of the test pyramid, and which free libraries fill the gaps.

## Application under test

All three frameworks test **Folio**, a reading app, on its development environment at `https://dev.agenticlibrary.app`. Each framework reads the address from `BASE_URL`, so it can point at another environment.

## Browsers

Every framework runs on **Chromium and Firefox** only.

| Framework | Native run | Docker run |
|---|---|---|
| Selenium | Chrome or Chrome for Testing, and Firefox | Google Chrome and Firefox |
| Playwright | Playwright's Chromium and Firefox | Same |
| Cypress | System Chromium and Firefox | Google Chrome and Firefox |

## Quick start

Pick a framework, go into its folder and follow its README. In short:

```sh
cd playwright-typescript-framework   # or selenium-java-framework, cypress-javascript-framework
cp .env.example .env                 # fill in the test user credentials
docker compose run --rm --build tests
```

There are two ways to run each framework:

- **Docker**, for full-suite runs locally and in CI. Each framework's `compose.yaml` builds an image that pins the tool and its browsers. Only Docker is needed.
- **Native**, for interactive work such as headed runs, the Cypress app or Playwright's UI mode, and for AI agents driving a browser. This needs the framework's toolchain: Java 25, or Node.js 22 or later, plus the browsers.

## Credentials

The tests use two test users, an admin and a member. Their credentials are never committed:

- Each framework has a `.env.example` listing the variables: `BASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `MEMBER_USERNAME` and `MEMBER_PASSWORD`. Copy it to `.env` and fill in the values.
- `.env` is gitignored everywhere and is never copied into a Docker image.
- In CI, supply the same variables as secrets; the Docker setup passes them into the container.

## Continuous integration

Each framework has one GitHub Actions workflow: [Selenium](.github/workflows/selenium.yml), [Playwright](.github/workflows/playwright.yml) and [Cypress](.github/workflows/cypress.yml). Each runs the framework's Docker suite, once per browser, on the maintainer's self-hosted runner. That's the same command as a local Docker run.

- A workflow runs on pushes to `main` that change its framework, or when started by hand from the Actions tab.
- Workflows never run on pull requests, because the runner is the maintainer's own machine.
- When a run fails, its report is attached to the run for 7 days.

## Working with AI agents

Each framework has an `AGENTS.md` with instructions for coding agents: the stack and versions, how to run tests, credential rules and links to the tool's documentation. The root [AGENTS.md](AGENTS.md) holds the rules that apply to the whole repository.

| Framework | Agent tooling |
|---|---|
| Selenium | Selenium's official guidance for AI agents, in `AGENTS.md`. No MCP server or skills. |
| Playwright | The `playwright-cli` skill, and Playwright's planner, generator and healer test agents with their MCP server |
| Cypress | Cypress's AI skills (`cypress-author`, `cypress-explain`, `cypress-tap`, `cypress-docs`) and `cypress tap` |

Start your agent session **inside a framework folder**, not at the repository root. Claude Code fully loads a folder's skills, agents and MCP servers only when the session starts there; the root `AGENTS.md` still applies.

## Repository layout

```
test-automation-hub/
├── .github/workflows/                # CI, one workflow per framework
├── AGENTS.md                         # rules for AI agents, whole repository
├── CAPABILITIES.md                   # what each tool can test
├── LICENSE                           # MIT
├── selenium-java-framework/
├── playwright-typescript-framework/
└── cypress-javascript-framework/
```

## License

[MIT](LICENSE)
