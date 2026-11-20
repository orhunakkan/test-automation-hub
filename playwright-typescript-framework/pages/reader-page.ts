import type { Locator, Page } from '@playwright/test';

export class ReaderPage {
  private readonly page: Page;
  readonly pageLabel: Locator;
  readonly nextPage: Locator;
  readonly contentsButton: Locator;
  readonly contentsDrawer: Locator;
  readonly contentsClose: Locator;

  constructor(page: Page) {
    this.page = page;
    const pageNavigation = page.getByRole('navigation', { name: 'Page navigation' });
    this.pageLabel = pageNavigation.getByText(/Page \d+ of \d+/);
    this.nextPage = pageNavigation.getByRole('link', { name: 'Next page' });
    this.contentsButton = page.getByRole('button', { name: 'Contents', exact: true });
    this.contentsDrawer = page.getByRole('dialog', { name: 'Contents' });
    this.contentsClose = this.contentsDrawer.getByRole('button', { name: 'Close', exact: true });
  }

  async open(path: string) {
    await this.page.goto(path);
    await this.page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  }

  async openContents() {
    await this.contentsButton.click();
  }
}
