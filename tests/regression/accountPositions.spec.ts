import { test, expect } from '../../fixtures/testFixtures';
import { accountExpectations } from '../../utils/testData';

test.describe('Regression | Account & Positions', () => {
  test('should validate account summary, watchlist, and positions table', async ({
    authenticatedPage,
    accountSummary,
    watchlist,
    positionsPage,
  }) => {
    await authenticatedPage.open();
    await authenticatedPage.assertLoaded();

    await accountSummary.assertLoaded();
    const summary = await accountSummary.getSummary();

    expect(summary.accountValue.length).toBeGreaterThan(0);
    expect(summary.buyingPower.length).toBeGreaterThan(0);
    expect(summary.plDay.length).toBeGreaterThan(0);

    const accountValueNumber = Number(summary.accountValue.replace(/[^0-9.-]/g, ''));
    const buyingPowerNumber = Number(summary.buyingPower.replace(/[^0-9.-]/g, ''));

    expect(Number.isNaN(accountValueNumber)).toBeFalsy();
    expect(Number.isNaN(buyingPowerNumber)).toBeFalsy();
    expect(accountValueNumber).toBeGreaterThanOrEqual(accountExpectations.minAccountValue);
    expect(buyingPowerNumber).toBeGreaterThanOrEqual(accountExpectations.minBuyingPower);

    await watchlist.assertLoaded();
    const symbols = await watchlist.getSymbols();
    expect(symbols.length).toBeGreaterThan(0);

    await positionsPage.openPositions();
    await expect(positionsPage.root).toBeVisible();
  });
});
