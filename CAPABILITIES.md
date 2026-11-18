# Tool capabilities

What Selenium, Cypress and Playwright can test, measured against the test pyramid.

Last checked 18 November 2026 against the latest stable releases: Selenium 4.53.0, Cypress 16.3.0 and Playwright 1.65.1.

Ground rules:

- Only free features count. Paid products, including Cypress Cloud and its free tier, are excluded.
- Unit tests, contract testing, accessibility, performance and load testing are left out of the built-in table, because none of the three tools covers them fully on its own.

## Built-in capabilities

Features that ship with each tool, with no third-party dependencies.

✅ built in · ⚠️ partial or limited · ❌ not available

| Pyramid layer | Test type | Selenium 4.53.0 (Java) | Cypress 16.3.0 (JS) | Playwright 1.65.1 (TS) |
|---|---|---|---|---|
| **Component** | Mounting UI components alone | ❌ | ✅ React 18–19, Vue 3, Angular 21–22; Svelte 5 is alpha | ✅ Built-in `mount` (stable since 1.62); any framework, using a gallery page you write |
| **Integration / API** | HTTP API tests | ❌ None in Selenium; the JDK's `HttpClient` works, but with no assertions | ✅ `cy.request` | ✅ `request` fixture |
| | Network stubbing and mocking | ⚠️ Cross-browser (BiDi) network module, beta in Java; can't read bodies | ✅ `cy.intercept` | ✅ `page.route`, HAR replay and recording |
| **UI / E2E** | Browser end-to-end flows | ✅ | ✅ | ✅ |
| | Cross-browser coverage | ✅ Chrome, Firefox, Edge, Safari | ⚠️ Chrome family and Firefox; WebKit is experimental and needs a package from Playwright | ✅ Chromium, Firefox, WebKit |
| | Multiple tabs, windows and origins | ✅ | ⚠️ No multiple tabs; `cy.origin` for other domains | ✅ |
| | Mobile | ⚠️ Chrome mobile emulation only | ⚠️ Viewport resizing only | ✅ Device emulation; Android is experimental |
| | Time and clock control | ❌ | ✅ `cy.clock` | ✅ `page.clock` |
| | Passkeys / WebAuthn | ⚠️ Virtual authenticator | ❌ | ✅ Virtual authenticator |
| **Non-functional** | Visual regression (image comparison) | ❌ Screenshots only | ❌ Screenshots only | ✅ `toHaveScreenshot` |
| **Infrastructure** | Test runner and assertions | ❌ Needs JUnit or TestNG | ✅ Bundled | ✅ Playwright Test |
| | Parallel / distributed runs | ✅ Selenium Grid | ❌ Not available; spec files can be split across CI jobs by hand, with no load balancing | ✅ Workers and sharding |
| | Debugging artefacts | ⚠️ Screenshots and logs | ✅ Screenshots, video, time-travel debugger in the local app | ✅ Screenshots, video, trace viewer |
| | AI-agent tooling | ❌ No agent tool; only written guidance for AI agents in the docs | ⚠️ No free MCP server (the official one needs Cypress Cloud). `cypress tap` is a local agent tool, in beta, `cypress open` and Chromium only; official AI skills are installed separately | ✅ MCP server and `playwright-cli` bundled since 1.62 |

## Filling the gaps with third-party libraries

Free libraries that can cover the ❌ and ⚠️ cells above. Playwright has no gaps in the built-in table, so only Selenium and Cypress are listed.

These picks haven't yet been checked against current docs and maintenance activity. Verify each one before adopting it.

### Selenium (Java)

| Gap | Free third-party option | Doable? |
|---|---|---|
| Test runner and assertions | JUnit 5 or TestNG, plus AssertJ for readable assertions | ✅ Required anyway |
| HTTP API tests | REST Assured | ✅ The standard choice in Java |
| Network stubbing and mocking | WireMock, which fakes the backend server rather than intercepting inside the browser | ⚠️ Works differently from Cypress and Playwright |
| Mobile | Appium Java client, plus the free Appium server, for real devices and emulators | ✅ Adds a server to run |
| Visual regression | AShot or Shutterbug to take screenshots, plus an image-comparison library | ⚠️ Less polished than Playwright's built-in option |
| Debugging artefacts | Allure Report for reports; Selenium's Docker images can record video | ✅ |
| Clock control | No library; inject a fake-timer script into the page | ⚠️ Do-it-yourself |
| Component testing | Nothing practical | ❌ |
| AI-agent tooling | Community MCP servers exist, but none is official or vetted | ⚠️ |

### Cypress (JS)

| Gap | Free third-party option | Doable? |
|---|---|---|
| Visual regression | `cypress-image-diff-js`, `cypress-visual-regression` or `@simonsmith/cypress-image-snapshot` | ✅ |
| Parallel runs | `cypress-split` splits specs across CI jobs for free; self-hosted orchestrators like Sorry-Cypress have been blocked by Cypress in newer versions | ✅ With `cypress-split` |
| Passkeys / WebAuthn | No library needed: Cypress can send Chrome DevTools commands directly, and Chrome has a virtual authenticator | ⚠️ Chromium only, do-it-yourself |
| Cross-browser (WebKit) | Already needs `playwright-webkit` and is still experimental; real Safari isn't possible | ⚠️ |
| Multiple tabs | No real fix; the usual workaround is stopping links from opening new tabs | ❌ A limit of how Cypress works |
| Mobile | Nothing beyond viewport resizing; no real devices | ❌ |
| AI-agent tooling | Nothing recommended over `cypress tap` | ⚠️ |

## Doable in all three

Test types every tool can cover, with built-in features or a free library. Rows in italics need a do-it-yourself workaround in one tool.

✅ built in · 📦 free third-party library · 🔧 do-it-yourself workaround

| Pyramid layer | Test type | Selenium 4.53.0 (Java) | Cypress 16.3.0 (JS) | Playwright 1.65.1 (TS) |
|---|---|---|---|---|
| **Integration / API** | HTTP API tests | 📦 REST Assured | ✅ `cy.request` | ✅ `request` fixture |
| | Network stubbing and mocking | ✅ BiDi network module (beta), or 📦 WireMock to fake the backend | ✅ `cy.intercept` | ✅ `page.route`, HAR |
| **UI / E2E** | Browser end-to-end flows | ✅ | ✅ | ✅ |
| | Cross-browser coverage | ✅ Chrome, Firefox, Edge, Safari | ✅ Chrome family and Firefox; no Safari | ✅ Chromium, Firefox, WebKit |
| **Non-functional** | Visual regression | 📦 AShot or Shutterbug, plus an image-comparison library | 📦 `cypress-image-diff-js` or similar | ✅ `toHaveScreenshot` |
| **Infrastructure** | Test runner and assertions | 📦 JUnit 5 or TestNG | ✅ Bundled | ✅ Playwright Test |
| | Parallel / distributed runs | ✅ Selenium Grid | 📦 `cypress-split` | ✅ Workers and sharding |
| | Debugging artefacts | ✅ Screenshots, plus 📦 Allure Report | ✅ Screenshots, video, time-travel debugger | ✅ Screenshots, video, trace viewer |
| | *Clock control* | 🔧 Inject a fake-timer script into the page | ✅ `cy.clock` | ✅ `page.clock` |
| | *Passkeys / WebAuthn* | ✅ Virtual authenticator | 🔧 Chrome DevTools commands, Chromium only | ✅ Virtual authenticator |

Left out because at least one tool can't do them:

- **Component testing:** Selenium can't.
- **Multiple tabs:** Cypress can't.
- **Real mobile devices:** Cypress can't.
- **AI-agent tooling:** Selenium has none, only unvetted community MCP servers.

## Not covered by any of the three

Test types none of the tools covers fully with built-in features. These need a separate tool or a third-party library.

⚠️ partial or limited · ❌ not available

| Pyramid layer | Test type | Best available |
|---|---|---|
| **Unit** | Unit tests of app code | ⚠️ Cypress and Playwright can run them, but neither is built for it |
| **Integration / API** | Contract / schema validation | ❌ None of the three |
| **Non-functional** | Accessibility | ⚠️ Cypress `cy.getByRole()` and Playwright ARIA snapshots; no WCAG audits |
| **Non-functional** | Performance | ⚠️ Selenium's Chromium-only (CDP) metrics and Playwright's tracing; no real performance testing |
| **Non-functional** | Load testing | ❌ None of the three |

## Testing Folio

Which test types the app under test, Folio on `https://dev.agenticlibrary.app`, gives something to test, whatever the tool. Checked on 18 November 2026 against the app's source.

Unit and component tests aren't listed: they belong in the app's own repository, next to its source.

✅ doable

| Pyramid layer | Test type | Doable? | Why |
|---|---|---|---|
| **Integration / API** | HTTP API tests | ✅ | There are many JSON endpoints (highlights, bookmarks, shelves, sync, lookup, flashcards, export, `/healthz`). Every POST must send an `Origin` header matching the site, or it gets a 403 |
| | Contract / schema validation | ✅ | There's no OpenAPI spec, so the schemas are written by hand. Base them on the documented JSON routes, not the internal TanStack server-function calls |
| | Network stubbing and mocking | ✅ | The app's own same-origin endpoints can be stubbed, such as Ask's streamed answers or word lookup. Anthropic, ElevenLabs and Open Library can't be, because the server calls them |
| **UI / E2E** | Browser end-to-end flows | ✅ | Library, reader, player, import, highlights, accounts, admin |
| | Cross-browser coverage | ✅ | Adds real value: the app's own suite is Chromium-only, and Safari is only checked by hand on an iPhone |
| | Multiple tabs, windows and origins | ✅ | Links open in new tabs on the book page, the private book page and the lookup card. Paddle's sandbox checkout is another origin. Sync across devices needs two browser contexts |
| | Mobile | ✅ | Responsive layout, installable as a web app |
| | Time and clock control | ✅ | Flashcards come due on a schedule, there's a sleep timer, and private offline downloads expire after 30 days. Session and reset-link expiry are decided on the server, so a fake browser clock can't move them |
| | Passkeys / WebAuthn | ✅ | Add a passkey on `/account` with the current password, sign in with it from `/login`, and remove it. A password reset removes every passkey. Dev only for now, not yet on production |
| **Non-functional** | Visual regression | ✅ | Every passing push to the app's `main` redeploys dev, so expect to update baselines often |
| | Accessibility | ✅ | The app's own suite already runs an axe scan on every screen |
| | Performance | ✅ | Page load and web vitals can be measured on dev. It runs on one server behind a Cloudflare tunnel, so results vary |
| | Load testing | ✅ | Within the limits in [Load testing on dev](#load-testing-on-dev) |
| **Infrastructure** | Runner, parallel runs, debugging artefacts, AI-agent tooling | ✅ | These depend on the tool, not the app. For parallel runs, give each worker its own account, so per-account limits don't collide |

Two things affect most rows:

- **Test accounts:** the app has no test API for making a fresh user per test, and sign-up on dev can only email 30 links a day. Use a few accounts made in advance, kept in the repository's Actions secrets.
- **Free plan limits:** a Free account can import 2 books and keep 50 highlights. Ask, translation, Markdown export, audiobook uploads, ElevenLabs voices and flashcards need Pro, so at least one test account should be Pro, which an admin can grant.

### Load testing on dev

This assumes production has no real users. Dev and production run on the same server, so while production is in use, load on dev reaches its users too.

What stays risky:

- **CI shares the machine.** The app's CI runs on a self-hosted runner on the server that hosts the site. If this repository's `CI_RUNNER` points at it too, a load test can slow or break CI runs and dev deploys.
- **Cloudflare is in front.** Dev is reached through a Cloudflare tunnel, which may throttle or challenge a burst of traffic from one IP. The server's own upload bandwidth can become the limit before the app does, which measures the network, not Folio.
- **One database server.** Dev and production have separate databases but share a PostgreSQL instance and its disk. A test that writes a lot, such as imports or highlights, fills that shared disk.
- **Mail quota.** Dev and production share 100 emails a day, and sign-up links are capped at 30 a day. Don't load sign-up, forgot-password or email confirmation.
- **The app's own limits.** All the load comes from one IP, so sign-in blocks it after 30 failures in 15 minutes, and many account actions have hourly limits, such as 10 exports an hour. Hitting them measures 429 errors, not capacity.

How to run it:

1. Load read-only public pages: home, library, book pages, reader pages and covers. The Open Graph images under `/og/` are CPU-heavy, so they make a good stress point.
2. Sign in a few accounts once and reuse their session cookies, instead of signing in under load.
3. Run the load generator from a different machine than the server.
4. Ramp up gradually, and stop at the first errors or Cloudflare challenges.
5. Pick a time when no CI run or deploy is happening.
