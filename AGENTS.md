# AGENTS.md

Instructions for AI coding agents working in this repository. Humans should start with the README.

## What this repository is

A public collection of test automation frameworks, one per tool and language. Each framework covers as many kinds of testing as its tool supports, not only UI end-to-end tests.

<!-- TODO: name the application(s) under test and where they run. -->

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
