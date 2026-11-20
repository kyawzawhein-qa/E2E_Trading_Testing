import { test, expect } from '../../fixtures/testFixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Regression | Accessibility', { tag: ['@regression'] }, () => {
  test('login and dashboard meet critical axe rules', async ({ page, loginPage, dashboardPage }) => {
    await loginPage.open();
    const loginScan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(loginScan.violations).toEqual([]);

    await loginPage.loginWithDefaults();
    await dashboardPage.assertLoaded();
    const dashboardScan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(dashboardScan.violations).toEqual([]);
  });
});