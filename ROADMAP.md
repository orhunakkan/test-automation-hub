# Roadmap

The order to implement the test types in the [Testing Folio](CAPABILITIES.md#testing-folio) table, easiest first. Easy means each of Cypress, Playwright and Selenium can do it with built-in features or one free library, so the three frameworks can grow together.

Suggested on 18 November 2026, when each framework had only a smoke test.

✅ built in · 📦 free third-party library · 🔧 do-it-yourself workaround · ⚠️ partial or limited · ❌ not possible

**Done** is Yes once the test type is implemented in every framework that can run it.

## 1. Easy in all three

Start here. Every tool has what it needs, or needs one standard library.

| Order | Test type | Selenium | Cypress | Playwright | Why now | Done |
|---|---|---|---|---|---|---|
| 1 | Browser end-to-end flows | ✅ | ✅ | ✅ | The base for everything else. The page objects and sign-in helpers written here are reused by most later rows | Yes |
| 2 | Cross-browser coverage | ✅ | ✅ | ✅ | Already in place: CI runs every framework in Chromium and Firefox, so each new test gets it for free | Yes |
| 3 | Mobile (responsive layout) | ✅ BiDi `setViewport` | ✅ `cy.viewport` | ✅ Device emulation | Rerun the end-to-end flows on a phone and a tablet. Real devices aren't needed for layout checks | Yes |
| 4 | HTTP API tests | 📦 REST Assured | ✅ `cy.request` | ✅ `request` fixture | Fast, stable tests. Selenium needs one dependency. Covers both ways to sign in: the session cookie, whose POSTs send a matching `Origin` header, and a bearer access token | Yes |

## 2. More work, or not possible in one framework

Each needs a library in every framework, or one framework needs a workaround, has limited support or can't do it at all. Worth doing after the first group.

| Order | Test type | Selenium | Cypress | Playwright | Why later | Done |
|---|---|---|---|---|---|---|
| 5 | Accessibility | 📦 axe-core for Selenium | 📦 `cypress-axe` | 📦 `@axe-core/playwright` | Each needs one axe library, and reuses the end-to-end pages. Check the libraries are maintained before adopting them | No |
| 6 | Contract / schema validation | 📦 REST Assured's JSON schema validator | 📦 A JSON schema library such as Ajv | 📦 A JSON schema library such as Ajv | Builds on the API tests. There's no API spec, so the schemas are written by hand, in each framework | No |
| 7 | Time and clock control | 🔧 Inject a fake-timer script | ✅ `cy.clock` | ✅ `page.clock` | Selenium needs a workaround. Only times the browser decides can be moved | No |
| 8 | Passkeys / WebAuthn | ✅ Virtual authenticator | 🔧 Chrome DevTools commands, Chromium only | ✅ Virtual authenticator | Cypress can't run it in Firefox. A test that resets the password also removes the account's passkeys | No |
| 9 | Multiple tabs, windows and origins | ✅ | ❌ | ✅ | Built in for Selenium and Playwright. Cypress can't follow new tabs, so it's left out there. Some links open new tabs, and checkout moves to Paddle's sandbox on another origin | No |
| 10 | Network stubbing and mocking | ⚠️ BiDi network module, beta in Java | ✅ `cy.intercept` | ✅ `page.route` | Selenium's support is limited. WireMock doesn't help here, because it fakes a backend you run, and Folio's backend is dev | No |
| 11 | Visual regression | 📦 AShot or Shutterbug, plus image comparison | 📦 `cypress-image-diff-js` or similar | ✅ `toHaveScreenshot` | Libraries in two frameworks, and dev redeploys often, so baselines need frequent updates. Keep it to a few stable screens | No |

## 3. Leave for later

None of the three frameworks covers these properly, so they need a tool outside them.

| Test type | Why | Done |
|---|---|---|
| Performance | No real performance testing in any of the three; only Chromium metrics in Selenium and tracing in Playwright | No |
| Load testing | None of the three generates load. It needs a separate tool, and the limits in [Load testing on dev](CAPABILITIES.md#load-testing-on-dev) | No |

## Before starting

- **Test accounts:** make a few in advance and keep them in the repository's Actions secrets and each framework's `.env`. At least one should be Pro, which an admin can grant, so the Pro-only features can be tested.
- **Parallel runs:** give each worker its own account, so per-account limits don't collide.
