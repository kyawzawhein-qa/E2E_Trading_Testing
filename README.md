# E2E Trading Testing

Playwright + TypeScript e2e for a stock order flow.

A sample QA automation portfolio project: end-to-end and API tests for a trading web application, structured with the Page Object Model (POM).

## What it covers

| Suite | Location | Focus |
|-------|----------|-------|
| Smoke | `tests/smoke/` | Login via fixtures; dashboard load with pre-authenticated `storageState` |
| E2E | `tests/e2e/` | Buy-order flow (SPCX market buy) with order and position validation |
| Regression | `tests/regression/` | Account summary, watchlist, and positions table |
| API | `api/` | Account summary, positions, login, and order lifecycle HTTP specs |

Page objects live under `pages/`: Login, Dashboard, TradeTicket, Orders, Positions, Watchlist, and AccountSummary (plus `BasePage`).

## Stack

- [Playwright](https://playwright.dev/) — browser and API testing
- **TypeScript** — typed tests and page objects
- **Page Object Model** — reusable page/component classes and shared fixtures

## Setup

**Requirements:** Node.js 20+ and npm.

```bash
git clone https://github.com/kyawzawhein-qa/E2E_Trading_Testing.git
cd E2E_Trading_Testing
npm install
npm run install:browsers
cp .env.example .env
```

Edit `.env` with your test credentials and target URLs. Do not commit `.env` or real secrets.

- `TEST_USERNAME` / `TEST_PASSWORD` — login credentials (required for authenticated runs)
- `BASE_URL` / `API_BASE_URL` — override defaults from `config/urls.ts`
- `TEST_ENV` — `qa`, `staging`, or `prod` (default: `qa`)

`global-setup.ts` logs in once and saves session state to `.auth/user.json` (`STORAGE_STATE_PATH`). Browser projects reuse that `storageState`; the API project runs without it.

## Running tests

```bash
npm test                  # full suite (tests/ + api/)
npm run test:smoke        # tests/smoke
npm run test:e2e          # tests/e2e
npm run test:regression   # tests/regression
npm run test:api          # api/

npm run test:qa           # TEST_ENV=qa
npm run test:staging      # TEST_ENV=staging
npm run test:prod         # TEST_ENV=prod

npm run test:headed       # visible browser
npm run test:ui           # Playwright UI mode
npm run test:debug        # debug mode
npm run report            # open HTML report
```

## Project layout

```
├── api/                    # API test specs
├── config/
│   ├── urls.ts             # env-aware URL map (qa / staging / prod)
│   └── credentials.ts      # placeholder credentials per environment
├── fixtures/               # Playwright fixtures (page objects, api client)
├── helpers/                # selectors, waits, browser utilities
├── pages/                  # Page Object Model classes
├── tests/
│   ├── smoke/
│   ├── e2e/
│   └── regression/
├── utils/                  # env loader, API client, test data, logger
├── global-setup.ts         # login + storageState bootstrap
├── playwright.config.ts
└── .github/workflows/
    └── playwright.yml      # CI (chromium + api on push/PR)
```

## Target URLs

`config/urls.ts` defines **example placeholder** hosts for each environment (e.g. `qa-trading.example.com`, `staging-trading.example.com`). They illustrate a sample trading app structure — login, dashboard, trade ticket, orders, positions, and account summary paths.

Point `BASE_URL` and `API_BASE_URL` in `.env` at your own test environment when running locally or in CI (GitHub Actions reads credentials from repository secrets).

## CI

The [Playwright workflow](.github/workflows/playwright.yml) runs on push and pull requests to `main` / `master` / `develop`, executing **chromium** and **api** projects. Reports and JUnit output are uploaded as artifacts.

## License

MIT — see [LICENSE](LICENSE).
