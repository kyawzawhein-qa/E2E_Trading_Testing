import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { resolveCredentials } from '../config/credentials';
import { resolveUrls, type EnvironmentName } from '../config/urls';

function resolveEnvFile(testEnv: string): string {
  const envSpecific = path.resolve(process.cwd(), `.env.${testEnv}`);
  if (fs.existsSync(envSpecific)) {
    return envSpecific;
  }
  return path.resolve(process.cwd(), '.env');
}

const initialEnv = (process.env.TEST_ENV || 'qa').toLowerCase();
dotenv.config({ path: resolveEnvFile(initialEnv) });
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: false });

const testEnv = (process.env.TEST_ENV || 'qa').toLowerCase() as EnvironmentName;

const urls = resolveUrls(testEnv, {
  baseUrl: process.env.BASE_URL,
  apiBaseUrl: process.env.API_BASE_URL,
});

const credentials = resolveCredentials(testEnv, {
  username: process.env.TEST_USERNAME || process.env.LOGIN_USERNAME,
  password: process.env.TEST_PASSWORD || process.env.LOGIN_PASSWORD,
});

function toBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') {
    return fallback;
  }
  return value.toLowerCase() === 'true';
}

function toNumber(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  testEnv,
  baseUrl: urls.baseUrl,
  apiBaseUrl: urls.apiBaseUrl,
  loginPath: urls.loginPath,
  dashboardPath: urls.dashboardPath,
  tradeTicketPath: urls.tradeTicketPath,
  ordersPath: urls.ordersPath,
  positionsPath: urls.positionsPath,
  accountSummaryPath: urls.accountSummaryPath,
  username: credentials.username,
  password: credentials.password,
  headless: toBoolean(process.env.HEADLESS, true),
  timeout: toNumber(process.env.TIMEOUT, 30000),
  slowMo: toNumber(process.env.SLOW_MO, 0),
  retries: toNumber(process.env.RETRIES, 1),
  workers: toNumber(process.env.WORKERS, 2),
  storageStatePath: process.env.STORAGE_STATE_PATH || '.auth/user.json',
  logLevel: (process.env.LOG_LEVEL || 'info').toLowerCase(),
  isCI: toBoolean(process.env.CI, false),
};

export type EnvConfig = typeof env;
