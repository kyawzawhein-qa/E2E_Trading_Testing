import { expect, Locator, Page } from '@playwright/test';
import { selectors } from '../helpers/selectors';
import type { OrderTab } from '../utils/testData';
import { orderTabs } from '../utils/testData';
import { logger } from '../utils/logger';
import { env } from '../utils/env';
import { BasePage } from './BasePage';

export class OrdersPage extends BasePage {
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.table = this.locator(selectors.orders.table);
  }

  async open(): Promise<void> {
    await this.navigate(env.ordersPath);
    await this.waitForLoad();
  }

  async openTab(tab: OrderTab | 'Activity' | 'Working' | 'Filled' | 'Canceled'): Promise<void> {
    logger.info(`Opening orders tab: ${tab}`);
    const tabLocator = this.locator(selectors.orders.tab(tab));
    await this.click(tabLocator);
    await this.waitForLoad();
  }

  findOrderBySymbol(symbol: string): Locator {
    return this.page.locator(selectors.orders.rowBySymbol(symbol)).first();
  }

  async assertOrderPresent(symbol: string): Promise<void> {
    const orderRow = this.findOrderBySymbol(symbol);
    await expect(orderRow).toBeVisible({ timeout: env.timeout });
    logger.info(`Order for ${symbol} found`);
  }

  async isOrderVisibleInTabs(
    symbol: string,
    tabs: Array<OrderTab | 'Working' | 'Filled'> = [orderTabs.working, orderTabs.filled],
  ): Promise<boolean> {
    for (const tab of tabs) {
      await this.openTab(tab);
      const row = this.findOrderBySymbol(symbol);
      if (await row.isVisible().catch(() => false)) {
        logger.info(`Order for ${symbol} found in ${tab} tab`);
        return true;
      }
    }
    return false;
  }
}
