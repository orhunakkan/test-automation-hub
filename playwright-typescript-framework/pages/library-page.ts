import type { Locator, Page } from '@playwright/test';

export class LibraryPage {
  private readonly page: Page;
  readonly heading: Locator;
  readonly searchBox: Locator;
  readonly count: Locator;
  readonly books: Locator;
  readonly accountMenu: Locator;
  readonly signOutButton: Locator;
  readonly signInLink: Locator;
  readonly sidebar: Locator;
  readonly menuButton: Locator;
  readonly menuDrawer: Locator;
  readonly menuLibraryLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.getByRole('complementary', { name: 'Site navigation' });
    this.menuButton = page.getByRole('button', { name: 'Open menu' });
    this.menuDrawer = page.getByRole('dialog', { name: 'Menu' });
    this.menuLibraryLink = this.menuDrawer.getByRole('link', { name: 'Library', exact: true });
    this.heading = page.getByRole('heading', { name: 'Library', exact: true });
    this.searchBox = page.getByRole('searchbox', { name: 'Search books' });
    this.count = page.getByText(/^Showing \d+ books?$/);
    this.books = page.getByTestId('book-card');
    this.accountMenu = this.sidebar.getByLabel(/^Account menu/);
    this.signOutButton = this.sidebar.getByRole('button', { name: 'Sign out' });
    this.signInLink = this.sidebar.getByRole('link', { name: 'Sign in' });
  }

  async open() {
    await this.page.goto('/library');
    await this.page.waitForFunction(() => document.documentElement.dataset.hydrated === 'true');
  }

  async search(query: string) {
    await this.searchBox.fill(query);
  }

  book(title: string) {
    return this.page.getByRole('link', { name: title });
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async signOut() {
    await this.accountMenu.click();
    await this.signOutButton.click();
  }
}
