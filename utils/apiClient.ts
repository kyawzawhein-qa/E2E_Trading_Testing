import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { env } from './env';
import { logger } from './logger';

export type RequestHeaders = Record<string, string>;
export type RequestData = Record<string, unknown> | string | Buffer | undefined;

export interface ApiClientOptions {
  baseURL?: string;
  headers?: RequestHeaders;
  timeout?: number;
  storageState?: string;
}

export class ApiClient {
  private context: APIRequestContext | null = null;
  private readonly options: Required<Pick<ApiClientOptions, 'baseURL' | 'timeout'>> &
    Pick<ApiClientOptions, 'headers' | 'storageState'>;

  constructor(options: ApiClientOptions = {}) {
    this.options = {
      baseURL: options.baseURL || env.apiBaseUrl,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      timeout: options.timeout || env.timeout,
      storageState: options.storageState,
    };
  }

  async init(): Promise<void> {
    if (this.context) {
      return;
    }

    this.context = await request.newContext({
      baseURL: this.options.baseURL,
      extraHTTPHeaders: this.options.headers,
      timeout: this.options.timeout,
      storageState: this.options.storageState,
    });

    logger.info(`API client initialized for ${this.options.baseURL}`);
  }

  private ensureContext(): APIRequestContext {
    if (!this.context) {
      throw new Error('ApiClient has not been initialized. Call init() before making requests.');
    }
    return this.context;
  }

  async get(endpoint: string, headers?: RequestHeaders): Promise<APIResponse> {
    const context = this.ensureContext();
    logger.debug(`GET ${endpoint}`);
    return context.get(endpoint, { headers });
  }

  async post(endpoint: string, data?: RequestData, headers?: RequestHeaders): Promise<APIResponse> {
    const context = this.ensureContext();
    logger.debug(`POST ${endpoint}`, data);
    return context.post(endpoint, { data, headers });
  }

  async put(endpoint: string, data?: RequestData, headers?: RequestHeaders): Promise<APIResponse> {
    const context = this.ensureContext();
    logger.debug(`PUT ${endpoint}`, data);
    return context.put(endpoint, { data, headers });
  }

  async delete(endpoint: string, headers?: RequestHeaders): Promise<APIResponse> {
    const context = this.ensureContext();
    logger.debug(`DELETE ${endpoint}`);
    return context.delete(endpoint, { headers });
  }

  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
      logger.info('API client disposed');
    }
  }
}

export async function createApiClient(options: ApiClientOptions = {}): Promise<ApiClient> {
  const client = new ApiClient(options);
  await client.init();
  return client;
}
