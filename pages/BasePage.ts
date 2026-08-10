import { expect, Locator, Page } from '@playwright/test';
import { waitForNetworkIdle } from '../helpers/wait';
import { env } from '../utils/env';
import { logger } from '../utils/logger';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    const target = url.startsWith('http') ? url : `${env.baseUrl}${url}`;
    logger.info(`Navigating to ${target}`);
    await this.page.goto(target, { waitUntil: 'domcontentloaded', timeout: env.timeout });
  }

  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: env.timeout });
    await locator.click();
  }

  async type(locator: Locator, text: string, options: { clear?: boolean } = {}): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: env.timeout });
    if (options.clear !== false) {
      await locator.fill('');
    }
    await locator.fill(text);
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await waitForNetworkIdle(this.page, 250);
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout: env.timeout });
    const text = await locator.innerText();
    return text.trim();
  }

  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible({ timeout: env.timeout });
  }

  locator(selector: string): Locator {
    return this.page.locator(selector).first();
  }
}
