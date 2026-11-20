import { test, expect } from '../../fixtures/testFixtures';
import { tradeDefaults } from '../../utils/testData';

/**
 * UI E2E against the repository's local mock trading target (not a live broker).
 */
test.describe('E2E | Market buy order', { tag: ['@regression'] }, () => {
  test.setTimeout(120_000);

  test('should buy shares and validate filled order plus position', async ({
    dashboardPage,
    tradeTicketPage: trade,
    ordersPage,
    positionsPage,
  }) => {
    const { symbol, quantity, orderType } = tradeDefaults;

    await dashboardPage.open();
    await dashboardPage.assertLoaded();
    await dashboardPage.page.goto('/trade');
    await trade.waitForLoad();

    await trade.placeMarketBuyOrder(symbol, quantity);
    await expect(trade.confirmation).toBeVisible();
    await expect(trade.confirmation).toContainText(symbol);

    await ordersPage.open();
    await ordersPage.openTab('Filled');
    await ordersPage.page.reload();
    await ordersPage.openTab('Filled');
    await ordersPage.assertOrderPresent(symbol);

    await positionsPage.openPositions();
    await positionsPage.assertPositionQuantity(symbol, quantity);
    const details = await positionsPage.getPositionDetails(symbol);
    expect(details.symbol).toBe(symbol);
    expect(details.qty).toContain(String(quantity));
    expect(orderType).toBe('Market');
  });
});