import { expect, Locator, Page } from '@playwright/test';
import { selectors } from '../helpers/selectors';
import { env } from '../utils/env';
import { logger } from '../utils/logger';
import { BasePage } from './BasePage';

export interface PositionDetails {
  symbol: string;
  qty: string;
  pl: string;
  cost: string;
  netLiq: string;
}

export class PositionsPage extends BasePage {
  readonly root: Locator;
  readonly openButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.locator(selectors.positions.root);
    this.openButton = this.locator(selectors.positions.openButton);
  }

  async openPositions(): Promise<void> {
    logger.info('Opening Positions view');
    if (await this.openButton.isVisible().catch(() => false)) {
      await this.click(this.openButton);
    } else {
      await this.navigate(env.positionsPath);
    }
    await this.waitForLoad();
    await this.assertVisible(this.root);
  }

  getPositionRow(symbol: string): Locator {
    return this.page.locator(selectors.positions.rowBySymbol(symbol)).first();
  }

  async getPositionDetails(symbol: string): Promise<PositionDetails> {
    const row = this.getPositionRow(symbol);
    await expect(row).toBeVisible({ timeout: env.timeout });

    const qty = (await row.locator(selectors.positions.qty).first().innerText()).trim();
    const pl = (await row.locator(selectors.positions.pl).first().innerText()).trim();
    const cost = (await row.locator(selectors.positions.cost).first().innerText()).trim();
    const netLiq = (await row.locator(selectors.positions.netLiq).first().innerText()).trim();

    const details: PositionDetails = { symbol, qty, pl, cost, netLiq };
    logger.info(`Position details for ${symbol}`, details);
    return details;
  }

  async assertPositionQuantity(symbol: string, expectedQty: number | string): Promise<void> {
    const details = await this.getPositionDetails(symbol);
    const normalizedActual = details.qty.replace(/,/g, '').trim();
    const normalizedExpected = String(expectedQty).replace(/,/g, '').trim();
    expect(normalizedActual).toContain(normalizedExpected);
  }
}
