import { test, expect } from '../../fixtures/index.js';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Folio/);
});
