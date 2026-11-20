import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { env } from './utils/env';

const bddTestDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'steps/*.ts',
  outputDir: '.features-gen',
});

const storageState = env.storageStatePath;

export default defineConfig({
  testDir: '.',
  testMatch: ['tests/**/*.spec.ts', 'api/**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? Math.max(env.retries, 1) : env.retries,
  workers: env.isCI ? 1 : env.workers,
  timeout: env.timeout,
  expect: {
    timeout: Math.min(env.timeout, 15000),
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit-report.xml' }],
  ],
  globalSetup: require.resolve('./global-setup'),
  webServer: {
    command: 'npx tsx mock-app/server.ts',
    url: `${env.baseUrl}/login`,
    reuseExistingServer: !env.isCI,
    timeout: 120_000,
  },
  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    actionTimeout: env.timeout,
    navigationTimeout: env.timeout,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    storageState,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'x-demo-auth': 'demo-session',
    },
  },
  projects: [
    {
      name: 'chromium',
      testMatch: 'tests/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], storageState },
    },
    {
      name: 'bdd',
      testDir: bddTestDir,
      testMatch: '**/*.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: 'api',
      testMatch: '**/*.spec.ts',
      use: {
        baseURL: env.apiBaseUrl,
        storageState: undefined,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-demo-auth': 'demo-session',
        },
      },
    },
  ],
  outputDir: 'test-results',
});