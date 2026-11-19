# Wiki

The plans for building this repository's tests: one plan per row of [ROADMAP.md](../ROADMAP.md), named after the row's order, such as `01-browser-e2e-flows.md`. A plan describes what to test in Folio, not how one tool does it, so the same plan serves Selenium, Cypress and Playwright.

## How the work runs

- **One phase, one commit.** Each phase is the smallest useful change, in one framework only. It's reviewed before it's committed, and the next phase starts after the commit.
- **Playwright first.** Each step of a plan is built in Playwright, then Cypress, then Selenium. Playwright's agent tooling is the quickest way to prove a scenario works on dev.
- **Same scenario, same name.** Every scenario has an ID, such as `E2E-03`, for referring to it in plans and phases. The test's title is the scenario's name, such as `wrong password is refused`, the same in all three frameworks, so results can be compared side by side. The ID isn't part of the title.
- **Done.** When a phase is committed, its row in the plan's Phases table is marked Yes. When the last phase of a plan is committed, the row in ROADMAP.md is marked Done, in a phase of its own.
- **App bugs.** A test that finds a bug in Folio is reported with evidence, never weakened or skipped to hide it.

## What a plan contains

1. **Goal:** what the row proves about Folio, and when it counts as done.
2. **Scope:** what's in, and what's deliberately left for later.
3. **Test data:** which accounts and books the scenarios use, and how they clean up after themselves.
4. **Scenarios:** each with an ID, steps and the expected result.
5. **Framework notes:** anything that differs between the three tools.
6. **Phases:** the ordered list of one-commit changes, with a Done column.
