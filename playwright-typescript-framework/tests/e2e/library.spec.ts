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

test('search finds a book', async ({ page }) => {
  const libraryPage = new LibraryPage(page);
  await libraryPage.open();
  await libraryPage.search('pride');
  await expect(libraryPage.searchBox).toHaveValue('pride');
  await expect(libraryPage.book('Pride and Prejudice')).toBeVisible();
  await expect(libraryPage.count).toHaveText('Showing 1 book');
});

test('search with no match', async ({ page }) => {
  const libraryPage = new LibraryPage(page);
  await libraryPage.open();
  await libraryPage.search('zyxwvq');
  await expect(libraryPage.searchBox).toHaveValue('zyxwvq');
  await expect(libraryPage.books).toHaveCount(0);
  await expect(libraryPage.count).toHaveText('Showing 0 books');
});
