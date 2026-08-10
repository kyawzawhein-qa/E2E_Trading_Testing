import { test as base, expect } from '@playwright/test';
import { ApiClient, createApiClient } from '../utils/apiClient';
import { env } from '../utils/env';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TradeTicketPage } from '../pages/TradeTicketPage';
import { OrdersPage } from '../pages/OrdersPage';
import { PositionsPage } from '../pages/PositionsPage';
import { AccountSummaryComponent } from '../pages/AccountSummaryComponent';
import { WatchlistComponent } from '../pages/WatchlistComponent';

type TradingFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  tradeTicketPage: TradeTicketPage;
  ordersPage: OrdersPage;
  positionsPage: PositionsPage;
  accountSummary: AccountSummaryComponent;
  watchlist: WatchlistComponent;
  apiClient: ApiClient;
  authenticatedPage: DashboardPage;
};

export const test = base.extend<TradingFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  tradeTicketPage: async ({ page }, use) => {
    await use(new TradeTicketPage(page));
  },

  ordersPage: async ({ page }, use) => {
    await use(new OrdersPage(page));
  },

  positionsPage: async ({ page }, use) => {
    await use(new PositionsPage(page));
  },

  accountSummary: async ({ page }, use) => {
    await use(new AccountSummaryComponent(page));
  },

  watchlist: async ({ page }, use) => {
    await use(new WatchlistComponent(page));
  },

  apiClient: async ({}, use) => {
    const client = await createApiClient();
    await use(client);
    await client.dispose();
  },

  authenticatedPage: async ({ page, loginPage, dashboardPage }, use) => {
    await loginPage.open();
    await loginPage.login(env.username, env.password);
    await dashboardPage.assertLoaded();
    await use(dashboardPage);
  },
});

export { expect };
