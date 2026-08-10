import { BrowserContext, Page } from '@playwright/test';
import { logger } from '../utils/logger';

export async function openNewTab(context: BrowserContext, url?: string): Promise<Page> {
  const page = await context.newPage();
  if (url) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
  }
  logger.info(`Opened new tab${url ? `: ${url}` : ''}`);
  return page;
}

export async function closeTabs(context: BrowserContext, keepFirst = true): Promise<void> {
  const pages = context.pages();
  const startIndex = keepFirst ? 1 : 0;

  for (let index = startIndex; index < pages.length; index += 1) {
    await pages[index].close();
  }

  logger.info(`Closed ${Math.max(pages.length - startIndex, 0)} tab(s)`);
}

export async function clearCookies(context: BrowserContext): Promise<void> {
  await context.clearCookies();
  logger.info('Cleared browser cookies');
}

export async function clearStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  logger.info('Cleared local and session storage');
}

export async function bringToFront(page: Page): Promise<void> {
  await page.bringToFront();
}
