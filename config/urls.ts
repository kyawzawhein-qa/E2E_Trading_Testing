export type EnvironmentName = 'qa' | 'staging' | 'prod';

export interface EnvironmentUrls {
  baseUrl: string;
  apiBaseUrl: string;
  loginPath: string;
  dashboardPath: string;
  tradeTicketPath: string;
  ordersPath: string;
  positionsPath: string;
  accountSummaryPath: string;
}

const urlMap: Record<EnvironmentName, EnvironmentUrls> = {
  qa: {
    baseUrl: 'https://qa-trading.example.com',
    apiBaseUrl: 'https://qa-api.trading.example.com',
    loginPath: '/login',
    dashboardPath: '/dashboard',
    tradeTicketPath: '/trade',
    ordersPath: '/orders',
    positionsPath: '/positions',
    accountSummaryPath: '/account/summary',
  },
  staging: {
    baseUrl: 'https://staging-trading.example.com',
    apiBaseUrl: 'https://staging-api.trading.example.com',
    loginPath: '/login',
    dashboardPath: '/dashboard',
    tradeTicketPath: '/trade',
    ordersPath: '/orders',
    positionsPath: '/positions',
    accountSummaryPath: '/account/summary',
  },
  prod: {
    baseUrl: 'https://trading.example.com',
    apiBaseUrl: 'https://api.trading.example.com',
    loginPath: '/login',
    dashboardPath: '/dashboard',
    tradeTicketPath: '/trade',
    ordersPath: '/orders',
    positionsPath: '/positions',
    accountSummaryPath: '/account/summary',
  },
};

export function getUrls(env: EnvironmentName = 'qa'): EnvironmentUrls {
  return urlMap[env];
}

export function resolveUrls(
  env: EnvironmentName,
  overrides?: Partial<Pick<EnvironmentUrls, 'baseUrl' | 'apiBaseUrl'>>,
): EnvironmentUrls {
  const defaults = getUrls(env);
  return {
    ...defaults,
    baseUrl: overrides?.baseUrl || defaults.baseUrl,
    apiBaseUrl: overrides?.apiBaseUrl || defaults.apiBaseUrl,
  };
}
