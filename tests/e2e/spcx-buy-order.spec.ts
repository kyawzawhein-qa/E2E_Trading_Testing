import { test, expect } from '../../fixtures/testFixtures';
import { env } from '../../utils/env';

/**
 * E2E: Place a BUY Market order for 100 shares of SPCX
 * on thinkorswim Web (paperMoney) and validate Orders + Positions.
 */
test.describe('E2E | SPCX Buy Order | thinkorswim Web (paperMoney)', () => {
  test.setTimeout(120_000);

  test('should buy 100 shares of SPCX and validate order + position', async ({
    loginPage: login,
    dashboardPage,
    tradeTicketPage: trade,
    ordersPage,
    positionsPage,
  }) => {
    const symbol = 'SPCX';
    const quantity = 100;
    const orderType = 'Market';

    // Resolve credentials from env (TEST_* preferred; USERNAME/PASSWORD also supported)
    const username = process.env.TEST_USERNAME || process.env.USERNAME!;
    const password = process.env.TEST_PASSWORD || process.env.PASSWORD!;

    // -----------------------------------------------------------------------
    // 1. Navigate to thinkorswim Web and log in
    // -----------------------------------------------------------------------
    await login.open();
    await login.waitForLoad();
    await expect(login.usernameInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();

    await login.login(username, password);
    await login.waitForLoad();

    // Confirm the trading dashboard is ready before placing an order
    await dashboardPage.assertLoaded();
    await expect(dashboardPage.root).toBeVisible();
    await expect(dashboardPage.navMenu).toBeVisible();

    // -----------------------------------------------------------------------
    // 2. Open Trade Ticket and search for SPCX
    // -----------------------------------------------------------------------
    await dashboardPage.goToTradeTicket();
    await trade.waitForLoad();
    await expect(trade.symbolSearch).toBeVisible();

    await trade.searchSymbol(symbol);
    await trade.waitForLoad();

    // -----------------------------------------------------------------------
    // 3. Open the trade ticket for the selected symbol
    // -----------------------------------------------------------------------
    await trade.openTradeTicket();
    await expect(trade.quantityInput).toBeVisible();
    await expect(trade.buyButton).toBeVisible();

    // -----------------------------------------------------------------------
    // 4. Configure BUY order: side, quantity, order type
    // -----------------------------------------------------------------------
    await trade.selectBuy();
    await trade.setQuantity(quantity);
    await trade.selectOrderType(orderType);

    // Defensive checks that the ticket reflects the intended order
    await expect(trade.quantityInput).toHaveValue(String(quantity));
    await expect(trade.buyButton).toBeVisible();

    // -----------------------------------------------------------------------
    // 5. Submit the order
    // -----------------------------------------------------------------------
    await trade.submitOrder();
    await trade.waitForLoad();

    // -----------------------------------------------------------------------
    // 6. Validate order appears in Working OR Filled (with retry)
    //    Market orders can fill quickly on paperMoney, so we poll both tabs.
    // -----------------------------------------------------------------------
    await ordersPage.open();
    await ordersPage.waitForLoad();
    await expect(ordersPage.table).toBeVisible();

    const maxAttempts = 5;
    const retryDelayMs = 2_000;
    let orderFound = false;
    let foundInTab: 'Working' | 'Filled' | null = null;

    for (let attempt = 1; attempt <= maxAttempts && !orderFound; attempt += 1) {
      // 6a. First check Working Orders
      await ordersPage.openTab('Working');
      await ordersPage.waitForLoad();
      const workingOrder = ordersPage.findOrderBySymbol(symbol);

      if (await workingOrder.isVisible().catch(() => false)) {
        await expect(workingOrder).toBeVisible();
        orderFound = true;
        foundInTab = 'Working';
        break;
      }

      // 6b. If not in Working, check Filled Orders
      await ordersPage.openTab('Filled');
      await ordersPage.waitForLoad();
      const filledOrder = ordersPage.findOrderBySymbol(symbol);

      if (await filledOrder.isVisible().catch(() => false)) {
        await expect(filledOrder).toBeVisible();
        orderFound = true;
        foundInTab = 'Filled';
        break;
      }

      // Brief pause before the next poll cycle (order may still be routing)
      if (attempt < maxAttempts) {
        await ordersPage.page.waitForTimeout(retryDelayMs);
      }
    }

    expect(
      orderFound,
      `Expected SPCX order to appear in Working or Filled within ${maxAttempts} attempts (env=${env.testEnv})`,
    ).toBeTruthy();
    expect(foundInTab).not.toBeNull();

    // -----------------------------------------------------------------------
    // 7. Validate SPCX appears in Positions with quantity = 100
    // -----------------------------------------------------------------------
    await positionsPage.openPositions();
    await positionsPage.waitForLoad();
    await expect(positionsPage.root).toBeVisible();

    const positionRow = positionsPage.getPositionRow(symbol);
    await expect(positionRow).toBeVisible();

    // Assert position quantity matches the submitted BUY of 100 shares
    await positionsPage.assertPositionQuantity(symbol, quantity);

    const details = await positionsPage.getPositionDetails(symbol);
    const normalizedQty = details.qty.replace(/,/g, '').trim();
    expect(normalizedQty).toContain(String(quantity));
    expect(details.symbol).toBe(symbol);
  });
});
