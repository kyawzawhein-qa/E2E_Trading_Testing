/**
 * Selector map for the repo mock target (data-testid first).
 * Fallback chains are valid Playwright selector engines only — no mixed invalid CSS.
 */
export const selectors = {
  login: {
    username: '[data-testid="login-username"]',
    password: '[data-testid="login-password"]',
    submit: '[data-testid="login-submit"]',
    error: '[data-testid="login-error"]',
  },
  dashboard: {
    root: '[data-testid="dashboard"]',
    navMenu: '[data-testid="nav-menu"]',
    tradeTicketNav: '[data-testid="nav-trade"]',
    positionsNav: '[data-testid="nav-positions"]',
    ordersNav: '[data-testid="nav-orders"]',
  },
  tradeTicket: {
    symbolSearch: '[data-testid="symbol-search"]',
    searchResult: (symbol: string) => `[data-testid="search-result-${symbol}"]`,
    openTicket: '[data-testid="open-trade-ticket"]',
    buyButton: '[data-testid="order-side-buy"]',
    sellButton: '[data-testid="order-side-sell"]',
    quantity: '[data-testid="order-quantity"]',
    orderType: '[data-testid="order-type"]',
    submit: '[data-testid="submit-order"]',
    confirmation: '[data-testid="order-confirmation"]',
  },
  orders: {
    tab: (name: string) => `[data-testid="orders-tab-${name.toLowerCase()}"]`,
    rowBySymbol: (symbol: string) => `[data-testid="order-row-${symbol}"]`,
    table: '[data-testid="orders-table"]',
  },
  positions: {
    root: '[data-testid="positions"]',
    openButton: '[data-testid="open-positions"]',
    rowBySymbol: (symbol: string) => `[data-testid="position-row-${symbol}"]`,
    qty: '[data-testid="position-qty"]',
    pl: '[data-testid="position-pl"]',
    cost: '[data-testid="position-cost"]',
    netLiq: '[data-testid="position-net-liq"]',
  },
  accountSummary: {
    root: '[data-testid="account-summary"]',
    accountValue: '[data-testid="account-value"]',
    buyingPower: '[data-testid="buying-power"]',
    plDay: '[data-testid="pl-day"]',
  },
  watchlist: {
    root: '[data-testid="watchlist"]',
    symbolCell: '[data-testid="watchlist-symbol"]',
    rowBySymbol: (symbol: string) => `[data-testid="watchlist-row-${symbol}"]`,
  },
} as const;