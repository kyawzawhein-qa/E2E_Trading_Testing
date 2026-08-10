import { expect, Locator, Page } from '@playwright/test';
import { selectors } from '../helpers/selectors';
import { env } from '../utils/env';
import { logger } from '../utils/logger';
import { BasePage } from './BasePage';

export class WatchlistComponent extends BasePage {
  readonly root: Locator;
  readonly symbolCells: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.locator(selectors.watchlist.root);
    this.symbolCells = this.page.locator(selectors.watchlist.symbolCell);
  }

  async assertLoaded(): Promise<void> {
    await this.assertVisible(this.root);
    await expect(this.symbolCells.first()).toBeVisible({ timeout: env.timeout });
  }

  async getSymbols(): Promise<string[]> {
    await this.assertLoaded();
    const texts = await this.symbolCells.allInnerTexts();
    const symbols = texts.map((text) => text.trim()).filter(Boolean);
    logger.info('Watchlist symbols', symbols);
    return symbols;
  }

  getRowBySymbol(symbol: string): Locator {
    return this.page.locator(selectors.watchlist.rowBySymbol(symbol)).first();
  }

  async assertSymbolPresent(symbol: string): Promise<void> {
    await expect(this.getRowBySymbol(symbol)).toBeVisible({ timeout: env.timeout });
  }
}
