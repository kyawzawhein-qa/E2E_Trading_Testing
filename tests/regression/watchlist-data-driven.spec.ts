import { test } from '../../fixtures/testFixtures';

const expectedWatchlistSymbols = [
  { symbol: 'SPCX' },
  { symbol: 'AAPL' },
  { symbol: 'SPY' },
  { symbol: 'TSLA' },
];

test.describe('Regression | Data-driven watchlist', { tag: ['@regression'] }, () => {
  for (const { symbol } of expectedWatchlistSymbols) {
    test(`watchlist includes ${symbol}`, async ({ authenticatedPage, watchlist }) => {
      await authenticatedPage.open();
      await authenticatedPage.assertLoaded();
      await watchlist.assertLoaded();
      await watchlist.assertSymbolPresent(symbol);
    });
  }
});