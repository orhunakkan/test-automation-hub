import { test, expect } from '../../fixtures/index.js';
import { LibraryPage } from '../../pages/library-page.js';

test('shows the sidebar', async ({ page }) => {
  const libraryPage = new LibraryPage(page);
  await libraryPage.open();
  await expect(libraryPage.sidebar).toBeVisible();
  await expect(libraryPage.menuButton).toBeHidden();
});
