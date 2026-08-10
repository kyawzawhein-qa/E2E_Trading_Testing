export const symbols = {
  spcx: 'SPCX',
  aapl: 'AAPL',
  tsla: 'TSLA',
  spy: 'SPY',
} as const;

export const orderTypes = {
  market: 'Market',
  limit: 'Limit',
  stop: 'Stop',
  stopLimit: 'Stop Limit',
} as const;

export const orderSides = {
  buy: 'Buy',
  sell: 'Sell',
} as const;

export const orderTabs = {
  activity: 'Activity',
  working: 'Working',
  filled: 'Filled',
  canceled: 'Canceled',
} as const;

export const tradeDefaults = {
  symbol: symbols.spcx,
  quantity: 100,
  orderType: orderTypes.market,
  side: orderSides.buy,
} as const;

export const accountExpectations = {
  minAccountValue: 0,
  minBuyingPower: 0,
} as const;

export const apiEndpoints = {
  login: '/auth/login',
  accountSummary: '/v1/account/summary',
  positions: '/v1/positions',
  orders: '/v1/orders',
  watchlist: '/v1/watchlist',
} as const;

export type OrderTab = (typeof orderTabs)[keyof typeof orderTabs];
export type OrderType = (typeof orderTypes)[keyof typeof orderTypes];
export type OrderSide = (typeof orderSides)[keyof typeof orderSides];
