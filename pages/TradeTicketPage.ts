import { Locator, Page } from '@playwright/test';
import { selectors } from '../helpers/selectors';
import { waitForElement } from '../helpers/wait';
import type { OrderType } from '../utils/testData';
import { logger } from '../utils/logger';
import { BasePage } from './BasePage';

export class TradeTicketPage extends BasePage {
  readonly symbolSearch: Locator;
  readonly openTicketButton: Locator;
  readonly buyButton: Locator;
  readonly sellButton: Locator;
  readonly quantityInput: Locator;
  readonly orderTypeSelect: Locator;
  readonly submitButton: Locator;
  readonly confirmation: Locator;

  constructor(page: Page) {
    super(page);
    this.symbolSearch = this.locator(selectors.tradeTicket.symbolSearch);
    this.openTicketButton = this.locator(selectors.tradeTicket.openTicket);
    this.buyButton = this.locator(selectors.tradeTicket.buyButton);
    this.sellButton = this.locator(selectors.tradeTicket.sellButton);
    this.quantityInput = this.locator(selectors.tradeTicket.quantity);
    this.orderTypeSelect = this.locator(selectors.tradeTicket.orderType);
    this.submitButton = this.locator(selectors.tradeTicket.submit);
    this.confirmation = this.locator(selectors.tradeTicket.confirmation);
  }

  async searchSymbol(symbol: string): Promise<void> {
    logger.info(`Searching for symbol ${symbol}`);
    await this.assertVisible(this.symbolSearch);
    await this.type(this.symbolSearch, symbol);
    const result = this.locator(selectors.tradeTicket.searchResult(symbol));
    await waitForElement(result);
    await this.click(result);
  }

  async openTradeTicket(): Promise<void> {
    logger.info('Opening trade ticket');
    await this.click(this.openTicketButton);
    await this.assertVisible(this.quantityInput);
  }

  async selectBuy(): Promise<void> {
    logger.info('Selecting BUY side');
    await this.click(this.buyButton);
  }

  async selectSell(): Promise<void> {
    logger.info('Selecting SELL side');
    await this.click(this.sellButton);
  }

  async setQuantity(qty: number | string): Promise<void> {
    logger.info(`Setting quantity to ${qty}`);
    await this.type(this.quantityInput, String(qty));
  }

  async selectOrderType(type: OrderType | string): Promise<void> {
    logger.info(`Selecting order type ${type}`);
    await this.assertVisible(this.orderTypeSelect);
    const tagName = await this.orderTypeSelect.evaluate((el) => el.tagName.toLowerCase());

    if (tagName === 'select') {
      await this.orderTypeSelect.selectOption({ label: type });
      return;
    }

    await this.click(this.orderTypeSelect);
    await this.click(this.page.getByRole('option', { name: type }).or(this.page.getByText(type, { exact: true })).first());
  }

  async submitOrder(): Promise<void> {
    logger.info('Submitting order');
    await this.click(this.submitButton);
    await this.waitForLoad();
  }

  async placeMarketBuyOrder(symbol: string, quantity: number): Promise<void> {
    await this.searchSymbol(symbol);
    await this.openTradeTicket();
    await this.selectBuy();
    await this.setQuantity(quantity);
    await this.selectOrderType('Market');
    await this.submitOrder();
  }
}
