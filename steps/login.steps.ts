import { expect } from '@playwright/test';
import { createBdd, test } from 'playwright-bdd';
import { env } from '../utils/env';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

const { Given, When, Then } = createBdd(test);

Given('I open the demo login page', async ({ page }) => {
  await page.request.post('/v1/test/reset');
  const loginPage = new LoginPage(page);
  await loginPage.open();
});

When('I sign in with demo credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(env.username, env.password);
});

Then('the trading dashboard is visible', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.assertLoaded();
  await expect(dashboardPage.root).toBeVisible();
});