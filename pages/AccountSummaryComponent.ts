import { Locator, Page } from '@playwright/test';
import { selectors } from '../helpers/selectors';
import { logger } from '../utils/logger';
import { BasePage } from './BasePage';

export class AccountSummaryComponent extends BasePage {
  readonly root: Locator;
  readonly accountValue: Locator;
  readonly buyingPower: Locator;
  readonly plDay: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.locator(selectors.accountSummary.root);
    this.accountValue = this.locator(selectors.accountSummary.accountValue);
    this.buyingPower = this.locator(selectors.accountSummary.buyingPower);
    this.plDay = this.locator(selectors.accountSummary.plDay);
  }

  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.root);
    await this.assertVisible(this.accountValue);
    await this.assertVisible(this.buyingPower);
    await this.assertVisible(this.plDay);
  }

  async getAccountValue(): Promise<string> {
    const value = await this.getText(this.accountValue);
    logger.info(`Account value: ${value}`);
    return value;
  }

  async getBuyingPower(): Promise<string> {
    const value = await this.getText(this.buyingPower);
    logger.info(`Buying power: ${value}`);
    return value;
  }

  async getPLDay(): Promise<string> {
    const value = await this.getText(this.plDay);
    logger.info(`P/L Day: ${value}`);
    return value;
  }

  async getSummary(): Promise<{ accountValue: string; buyingPower: string; plDay: string }> {
    return {
      accountValue: await this.getAccountValue(),
      buyingPower: await this.getBuyingPower(),
      plDay: await this.getPLDay(),
    };
  }
}
