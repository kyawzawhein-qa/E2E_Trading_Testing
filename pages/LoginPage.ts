import { Locator, Page } from '@playwright/test';
import { selectors } from '../helpers/selectors';
import { env } from '../utils/env';
import { logger } from '../utils/logger';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.locator(selectors.login.username);
    this.passwordInput = this.locator(selectors.login.password);
    this.loginButton = this.locator(selectors.login.submit);
    this.errorMessage = this.locator(selectors.login.error);
  }

  async open(): Promise<void> {
    await this.navigate(env.loginPath);
    await this.waitForLoad();
  }

  async login(username: string, password: string): Promise<void> {
    logger.info(`Logging in as ${username}`);
    await this.assertVisible(this.usernameInput);
    await this.type(this.usernameInput, username);
    await this.type(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForLoad();
  }

  async loginWithDefaults(): Promise<void> {
    await this.login(env.username, env.password);
  }
}
