# E2E Trading Test Suite (Portfolio)

[![Playwright Trading E2E](https://github.com/kyawzawhein-qa/E2E_Trading_Testing/actions/workflows/playwright.yml/badge.svg)](https://github.com/kyawzawhein-qa/E2E_Trading_Testing/actions/workflows/playwright.yml)

Playwright + TypeScript end-to-end and API automation for a **local mock trading web app** included in this repository. The mock target demonstrates login, dashboard, trade ticket, orders, positions, REST checks, accessibility scanning, and a **concurrency scenario** (simultaneous cancel vs fill). It is a portfolio sample only — not wired to any real broker or employer codebase.

## What this demonstrates

| Area | Location | Notes |
|------|----------|-------|
| Smoke | `tests/smoke/`, `features/login.feature` | Login + dashboard; one Gherkin scenario via playwright-bdd |
| E2E | `tests/e2e/` | Market buy through UI, order + position validation |
| Regression | `tests/regression/` | Account/watchlist/positions, data-driven watchlist, axe a11y, cancel/fill race |
| API | `api/` | Playwright `request` client — account, positions, auth, order lifecycle |
| Mock target | `mock-app/` | Express UI + in-memory order engine (deterministic CI) |

**Tags:** `@smoke`, `@regression`, `@api`, `@bdd` (see npm scripts below).

**Concurrency demo (mock):** `tests/regression/order-cancel-fill-race.spec.ts` places a pending order, fires cancel and fill concurrently against `/v1/test/orders/:id/race-cancel-fill`, and asserts exactly one terminal outcome — never both shares and a refund.

## Stack

- Playwright (TypeScript) — UI + API
- Page Object Model + typed fixtures (`fixtures/testFixtures.ts`)
- Env-based config (`utils/env.ts`, `.env.example`)
- `@axe-core/playwright` — accessibility checks
- playwright-bdd — optional thin Gherkin layer (1 feature)
- GitHub Actions — lint, typecheck, tests, HTML report + traces on failure

## Prerequisites

- Node.js 20+
- npm

## Quick start

```bash
git clone https://github.com/kyawzawhein-qa/E2E_Trading_Testing.git
cd E2E_Trading_Testing
npm install
npm run install:browsers
cp .env.example .env
npm test
```

Playwright starts the mock server (`mock-app/server.ts`) automatically via `webServer` in `playwright.config.ts`. Default URLs point at `http://127.0.0.1:4173`.

Demo credentials (mock only):

- `TEST_USERNAME=qa.trader@example.com`
- `TEST_PASSWORD=QaTradePass123!`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm test` | Full suite (bddgen + chromium + api) |
| `npm run test:smoke` | `@smoke` |
| `npm run test:regression` | `@regression` |
| `npm run test:api` | API project only |
| `npm run test:e2e` | `tests/e2e` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run report` | Open last HTML report |

## Project structure

```
├── api/                      # API specs (@api)
├── config/                   # URL + credential maps
├── features/                 # Gherkin features
├── fixtures/                 # Typed Playwright fixtures
├── helpers/                  # Selectors, waits
├── mock-app/                 # Demo trading UI + order engine
├── pages/                    # Page Object Model
├── steps/                    # BDD step definitions
├── tests/
│   ├── smoke/
│   ├── e2e/
│   └── regression/
├── global-setup.ts           # Login + storageState for browser tests
└── playwright.config.ts
```

## CI

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs `npm run bddgen`, `typecheck`, `lint`, and the full Playwright suite against the local mock (no external secrets). Artifacts: HTML report always; Playwright traces when a job fails.

## Reports

- HTML: `playwright-report/` (also CI artifact)
- JUnit: `test-results/junit-report.xml`

## License

MIT — see [LICENSE](LICENSE).