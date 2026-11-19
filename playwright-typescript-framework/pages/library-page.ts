import type { Locator, Page } from '@playwright/test';

export class LibraryPage {
  readonly heading: Locator;
  readonly accountMenu: Locator;
  readonly signOutButton: Locator;
  readonly signInLink: Locator;

  constructor(page: Page) {
    const sidebar = page.getByRole('complementary', { name: 'Site navigation' });
    this.heading = page.getByRole('heading', { name: 'Library', exact: true });
    this.accountMenu = sidebar.getByLabel(/^Account menu/);
    this.signOutButton = sidebar.getByRole('button', { name: 'Sign out' });
    this.signInLink = sidebar.getByRole('link', { name: 'Sign in' });
  }

  async signOut() {
    await this.accountMenu.click();
    await this.signOutButton.click();
  }
}
