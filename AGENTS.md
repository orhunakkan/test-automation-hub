# AGENTS.md

Instructions for AI coding agents working in this repository. Humans should start with the README.

## What this repository is

A public collection of test automation frameworks, one per tool and language. Each framework covers as many kinds of testing as its tool supports, not only UI end-to-end tests.

## Application under test

All frameworks test Folio, on its development environment at `https://dev.agenticlibrary.app`. Its source is the private repository `orhunakkan/agentic-library`, which maintainers clone next to this one at `../agentic-library`.

- When a test finds an app bug, report it with evidence: the failing test, the steps and what was expected. Ask before changing the app, and when you do, follow that repository's own `CLAUDE.md`.
- Never weaken, skip or delete a test to hide an app bug.

## Repository map

| Folder | Tool | Language |
|---|---|---|
| `selenium-java-framework/` | Selenium | Java |
| `playwright-typescript-framework/` | Playwright | TypeScript |
| `cypress-javascript-framework/` | Cypress | JavaScript |

Each framework is self-contained, with its own dependencies, configuration, and `AGENTS.md`. Before working in a framework folder, read that folder's `AGENTS.md`.

<!-- TODO: list the test types each framework covers (UI, API, visual, accessibility, component, performance, ...). -->

## Rules for all frameworks

- Keep each change inside one framework folder. Don't share code, configuration, or dependencies between frameworks unless asked.
- Never commit secrets, tokens, or real credentials. This repository is public.

<!-- TODO: shared conventions (test naming, tagging, test data, commit style). -->

## Continuous integration

Each framework has one GitHub Actions workflow in `.github/workflows/` (`selenium.yml`, `playwright.yml`, `cypress.yml`). Each runs the framework's Docker suite in both its browsers on the maintainer's self-hosted runner, chosen by the repository variable `CI_RUNNER`. Credentials come from the repository's Actions secrets.

- Workflows run on pushes to `main` that change their framework, and by hand. Never add `pull_request` or `pull_request_target` triggers: this repository is public, and a pull request's code must never run on the maintainer's machine.
- Keep each job to the framework's own Docker command, so a CI run is the same as `docker compose run --rm --build tests` locally.
- Never put a runner name, machine detail or credential in a workflow file.
