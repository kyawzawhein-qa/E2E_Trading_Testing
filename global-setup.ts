import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { env } from './utils/env';
import { logger } from './utils/logger';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

async function globalSetup(config: FullConfig): Promise<void> {
  const storageStatePath = path.resolve(process.cwd(), env.storageStatePath);
  const authDir = path.dirname(storageStatePath);

  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  logger.info(`Running global setup for environment: ${env.testEnv}`);
  logger.info(`Base URL: ${env.baseUrl}`);

  const browser = await chromium.launch({ headless: env.headless });
  const context = await browser.newContext({
    baseURL: config.projects[0]?.use?.baseURL || env.baseUrl,
  });
  const page = await context.newPage();

  try {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.open();
    await loginPage.login(env.username, env.password);
    await dashboardPage.assertLoaded();
    await context.storageState({ path: storageStatePath });
    logger.info(`Storage state saved to ${storageStatePath}`);
  } catch (error) {
    logger.warn(
      'Global setup login failed. Tests that rely on storageState may authenticate via fixtures instead.',
      error instanceof Error ? error.message : error,
    );

    const emptyState = {
      cookies: [],
      origins: [],
    };
    fs.writeFileSync(storageStatePath, JSON.stringify(emptyState, null, 2));
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
