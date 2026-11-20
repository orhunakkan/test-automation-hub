import { test, expect } from '../../fixtures/index.js';
import { LibraryPage } from '../../pages/library-page.js';
import { ReaderPage } from '../../pages/reader-page.js';

test('shows the top bar', async ({ page }) => {
  const libraryPage = new LibraryPage(page);
  await libraryPage.open();
  await expect(libraryPage.menuButton).toBeVisible();
  await expect(libraryPage.sidebar).toBeHidden();
});

test('menu opens the drawer', async ({ page }) => {
  const libraryPage = new LibraryPage(page);
  await libraryPage.open();
  await libraryPage.openMenu();
  await expect(libraryPage.menuDrawer).toBeVisible();
  await expect(libraryPage.menuLibraryLink).toBeVisible();
});

test('reader uses a contents drawer', async ({ page }) => {
  const readerPage = new ReaderPage(page);
  await readerPage.open('/read/pride-and-prejudice/chapter-1');
  await readerPage.openContents();
  await expect(readerPage.contentsDrawer).toBeVisible();
  await expect(readerPage.contentsClose).toBeVisible();
});
