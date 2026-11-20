import type { Locator, Page } from '@playwright/test';

export class AccountPage {
  private readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('account-title');
  }

  async open() {
    await this.page.goto('/account');
    await this.page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  }
}
