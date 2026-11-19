import { test, expect, member, admin } from '../../fixtures/index.js';
import { LibraryPage } from '../../pages/library-page.js';

test('member signs out', async ({ page, signIn }) => {
  const libraryPage = new LibraryPage(page);
  await signIn(member);
  await page.goto('/library');
  await libraryPage.signOut();
  await expect(libraryPage.signInLink).toBeVisible();
});

test('admin signs out', async ({ page, signIn }) => {
  const libraryPage = new LibraryPage(page);
  await signIn(admin);
  await page.goto('/library');
  await libraryPage.signOut();
  await expect(libraryPage.signInLink).toBeVisible();
});
