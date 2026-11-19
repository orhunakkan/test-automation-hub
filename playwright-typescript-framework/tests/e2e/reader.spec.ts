import { test, expect } from '../../fixtures/index.js';
import { BookPage } from '../../pages/book-page.js';
import { ReaderPage } from '../../pages/reader-page.js';

test('start reading', async ({ page }) => {
  const bookPage = new BookPage(page);
  const readerPage = new ReaderPage(page);
  await page.goto('/library/jane-austen/pride-and-prejudice');
  await bookPage.startReading.click();
  await expect(readerPage.pageLabel).toContainText('Chapter 1 · Page 1 of');
});

test('turn a page', async ({ page }) => {
  const readerPage = new ReaderPage(page);
  await page.goto('/read/pride-and-prejudice/chapter-1');
  await expect(readerPage.pageLabel).toContainText('Chapter 1 · Page 1 of');
  await readerPage.nextPage.click();
  await expect(readerPage.pageLabel).toContainText('Chapter 1 · Page 2 of');
});
