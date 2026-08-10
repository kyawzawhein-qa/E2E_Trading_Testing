export const selectors = {
  login: {
    username: '[data-testid="login-username"], #username, input[name="username"]',
    password: '[data-testid="login-password"], #password, input[name="password"]',
    submit: '[data-testid="login-submit"], button[type="submit"], #login-button',
    error: '[data-testid="login-error"], .login-error',
  },
  dashboard: {
    root: '[data-testid="dashboard"], #dashboard, .dashboard',
    navMenu: '[data-testid="nav-menu"], nav[role="navigation"], .main-nav',
    tradeTicketNav: '[data-testid="nav-trade"], a[href*="trade"], text=Trade',
    positionsNav: '[data-testid="nav-positions"], a[href*="positions"], text=Positions',
    ordersNav: '[data-testid="nav-orders"], a[href*="orders"], text=Orders',
  },
  tradeTicket: {
    symbolSearch: '[data-testid="symbol-search"], input[name="symbol"], #symbol-search',
    searchResult: (symbol: string) =>
      `[data-testid="search-result-${symbol}"], [data-symbol="${symbol}"], text=${symbol}`,
    openTicket: '[data-testid="open-trade-ticket"], button:has-text("Trade"), #open-trade-ticket',
    buyButton: '[data-testid="order-side-buy"], button:has-text("Buy"), #buy-button',
    sellButton: '[data-testid="order-side-sell"], button:has-text("Sell"), #sell-button',
    quantity: '[data-testid="order-quantity"], input[name="quantity"], #quantity',
    orderType: '[data-testid="order-type"], select[name="orderType"], #order-type',
    submit: '[data-testid="submit-order"], button:has-text("Submit"), #submit-order',
    confirmation: '[data-testid="order-confirmation"], .order-confirmation',
  },
  orders: {
    tab: (name: string) =>
      `[data-testid="orders-tab-${name.toLowerCase()}"], [role="tab"]:has-text("${name}"), button:has-text("${name}")`,
    rowBySymbol: (symbol: string) =>
      `[data-testid="order-row-${symbol}"], tr[data-symbol="${symbol}"], table tbody tr:has-text("${symbol}")`,
    table: '[data-testid="orders-table"], table.orders-table, #orders-table',
  },
  positions: {
    root: '[data-testid="positions"], #positions, .positions-panel',
    openButton: '[data-testid="open-positions"], a[href*="positions"], button:has-text("Positions")',
    rowBySymbol: (symbol: string) =>
      `[data-testid="position-row-${symbol}"], tr[data-symbol="${symbol}"], table tbody tr:has-text("${symbol}")`,
    qty: '[data-testid="position-qty"], td[data-field="qty"], .position-qty',
    pl: '[data-testid="position-pl"], td[data-field="pl"], .position-pl',
    cost: '[data-testid="position-cost"], td[data-field="cost"], .position-cost',
    netLiq: '[data-testid="position-net-liq"], td[data-field="netLiq"], .position-net-liq',
  },
  accountSummary: {
    root: '[data-testid="account-summary"], #account-summary, .account-summary',
    accountValue: '[data-testid="account-value"], [data-field="accountValue"], .account-value',
    buyingPower: '[data-testid="buying-power"], [data-field="buyingPower"], .buying-power',
    plDay: '[data-testid="pl-day"], [data-field="plDay"], .pl-day',
  },
  watchlist: {
    root: '[data-testid="watchlist"], #watchlist, .watchlist',
    symbolCell: '[data-testid="watchlist-symbol"], td[data-field="symbol"], .watchlist-symbol',
    rowBySymbol: (symbol: string) =>
      `[data-testid="watchlist-row-${symbol}"], tr[data-symbol="${symbol}"], .watchlist tr:has-text("${symbol}")`,
  },
} as const;
