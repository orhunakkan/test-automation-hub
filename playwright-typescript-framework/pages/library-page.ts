import type { Locator, Page } from '@playwright/test';

export class LibraryPage {
  readonly heading: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { name: 'Library', exact: true });
  }
}
