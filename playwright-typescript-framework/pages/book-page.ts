import type { Locator, Page } from '@playwright/test';

export class BookPage {
  readonly title: Locator;
  readonly startReading: Locator;

  constructor(page: Page) {
    this.title = page.getByRole('heading', { level: 1 });
    this.startReading = page.getByRole('link', { name: 'Start reading' });
  }
}
