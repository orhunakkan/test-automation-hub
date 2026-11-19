import { test, expect } from '../../fixtures/index.js';
import { BookPage } from '../../pages/book-page.js';
import { LibraryPage } from '../../pages/library-page.js';

test('library loads', async ({ page }) => {
  const libraryPage = new LibraryPage(page);
  await page.goto('/library');
  await expect(libraryPage.heading).toBeVisible();
});

test('library opens a book', async ({ page }) => {
  const libraryPage = new LibraryPage(page);
  const bookPage = new BookPage(page);
  await page.goto('/library');
  await libraryPage.book('Pride and Prejudice').click();
  await expect(bookPage.title).toHaveText('Pride and Prejudice');
  await expect(bookPage.startReading).toBeVisible();
});
