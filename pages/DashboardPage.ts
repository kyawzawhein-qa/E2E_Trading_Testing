import { expect, Locator, Page } from '@playwright/test';
import { selectors } from '../helpers/selectors';
import { env } from '../utils/env';
import { logger } from '../utils/logger';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly root: Locator;
  readonly navMenu: Locator;
  readonly tradeTicketNav: Locator;
  readonly positionsNav: Locator;
  readonly ordersNav: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.locator(selectors.dashboard.root);
    this.navMenu = this.locator(selectors.dashboard.navMenu);
    this.tradeTicketNav = this.locator(selectors.dashboard.tradeTicketNav);
    this.positionsNav = this.locator(selectors.dashboard.positionsNav);
    this.ordersNav = this.locator(selectors.dashboard.ordersNav);
  }

  async open(): Promise<void> {
    await this.navigate(env.dashboardPath);
    await this.waitForLoad();
  }

  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.root);
    await this.assertVisible(this.navMenu);
    await expect(this.page).toHaveURL(/dashboard|home|trading/i);
    logger.info('Dashboard loaded successfully');
  }

  async goToTradeTicket(): Promise<void> {
    logger.info('Navigating to Trade Ticket');
    await this.click(this.tradeTicketNav);
    await this.waitForLoad();
  }

  async goToPositions(): Promise<void> {
    logger.info('Navigating to Positions');
    await this.click(this.positionsNav);
    await this.waitForLoad();
  }

  async goToOrders(): Promise<void> {
    logger.info('Navigating to Orders');
    await this.click(this.ordersNav);
    await this.waitForLoad();
  }
}
