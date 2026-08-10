import { test, expect } from '../../fixtures/testFixtures';
import { env } from '../../utils/env';

test.describe('Smoke | Login', () => {
  test('should login using fixtures and load dashboard', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.open();
    await loginPage.login(env.username, env.password);
    await dashboardPage.assertLoaded();

    await expect(dashboardPage.root).toBeVisible();
    await expect(dashboardPage.navMenu).toBeVisible();
  });

  test('should land on dashboard when already authenticated via storageState', async ({
    dashboardPage,
  }) => {
    await dashboardPage.open();
    await dashboardPage.assertLoaded();
    await expect(dashboardPage.root).toBeVisible();
  });
});
