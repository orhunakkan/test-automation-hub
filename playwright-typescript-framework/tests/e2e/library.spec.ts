import { test, expect } from '../../fixtures/index.js';
import { LibraryPage } from '../../pages/library-page.js';

test('library loads', async ({ page }) => {
  const library = new LibraryPage(page);
  await page.goto('/library');
  await expect(library.heading).toBeVisible();
});
