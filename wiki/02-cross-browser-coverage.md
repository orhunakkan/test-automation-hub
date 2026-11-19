# 02 · Cross-browser coverage

## Goal

Every test runs in Chromium and Firefox, in all three frameworks.

This is already in place, so the row is marked Done in ROADMAP.md. Each framework's CI workflow runs its whole suite once per browser, so every new test gets both browsers without extra work.

## Scope

- **In:** Chromium and Firefox.
- **Out:** WebKit, Edge, branded Chrome and Safari. The frameworks' `AGENTS.md` files allow only Chromium and Firefox, and Safari can't run on the Linux CI runner.

## Rules for every other plan

- A new test must pass in both browsers before its phase is committed.
- A test may skip one browser only for a documented limit of the tool, such as Cypress's passkey workaround, which only works in Chromium. The skip names the reason in the code.
- A test that fails in one browser because of Folio is an app bug: report it with evidence, and don't skip the test to hide it.

## Phases

None. The setup was done when the frameworks were scaffolded.
