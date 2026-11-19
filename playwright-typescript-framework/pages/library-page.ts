import type { Locator, Page } from '@playwright/test';

export class LibraryPage {
  readonly heading: Locator;
  readonly accountMenu: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { name: 'Library', exact: true });
    this.accountMenu = page.getByRole('complementary', { name: 'Site navigation' }).getByLabel(/^Account menu/);
  }
}
