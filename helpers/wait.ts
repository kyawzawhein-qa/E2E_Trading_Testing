import { Locator, Page, expect } from '@playwright/test';
import { env } from '../utils/env';

export async function waitForNetworkIdle(page: Page, idleMs = 500): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(idleMs);
}

export async function waitForElement(
  locator: Locator,
  options: { timeout?: number; state?: 'attached' | 'detached' | 'visible' | 'hidden' } = {},
): Promise<void> {
  await locator.waitFor({
    state: options.state || 'visible',
    timeout: options.timeout || env.timeout,
  });
}

export async function waitForText(
  locator: Locator,
  text: string | RegExp,
  timeout = env.timeout,
): Promise<void> {
  await expect(locator).toContainText(text, { timeout });
}

export async function waitForUrlContains(page: Page, fragment: string | RegExp): Promise<void> {
  await page.waitForURL(fragment, { timeout: env.timeout });
}
