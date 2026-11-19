import type { Locator, Page } from '@playwright/test';

export class ReaderPage {
  readonly pageLabel: Locator;
  readonly nextPage: Locator;

  constructor(page: Page) {
    const pageNavigation = page.getByRole('navigation', { name: 'Page navigation' });
    this.pageLabel = pageNavigation.getByText(/Page \d+ of \d+/);
    this.nextPage = pageNavigation.getByRole('link', { name: 'Next page' });
  }
}
