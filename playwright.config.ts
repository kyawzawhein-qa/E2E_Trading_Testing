import { defineConfig, devices } from '@playwright/test';
import { env } from './utils/env';

const storageState = env.storageStatePath;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? Math.max(env.retries, 1) : env.retries,
  workers: env.isCI ? 2 : env.workers,
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
  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    actionTimeout: env.timeout,
    navigationTimeout: env.timeout,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    storageState,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState },
    },
    {
      name: 'api',
      testDir: './api',
      use: {
        baseURL: env.apiBaseUrl,
        storageState: undefined,
      },
    },
  ],
  outputDir: 'test-results',
});
