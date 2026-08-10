import type { EnvironmentName } from './urls';

export interface Credentials {
  username: string;
  password: string;
}

const credentialMap: Record<EnvironmentName, Credentials> = {
  qa: {
    username: 'qa.trader@example.com',
    password: 'QaTradePass123!',
  },
  staging: {
    username: 'staging.trader@example.com',
    password: 'StagingTradePass123!',
  },
  prod: {
    username: 'prod.trader@example.com',
    password: 'ProdTradePass123!',
  },
};

export function getCredentials(env: EnvironmentName = 'qa'): Credentials {
  return credentialMap[env];
}

export function resolveCredentials(
  env: EnvironmentName,
  overrides?: Partial<Credentials>,
): Credentials {
  const defaults = getCredentials(env);
  return {
    username: overrides?.username || defaults.username,
    password: overrides?.password || defaults.password,
  };
}
