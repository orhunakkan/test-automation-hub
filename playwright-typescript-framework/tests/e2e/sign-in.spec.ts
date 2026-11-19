import { test, expect } from '../../fixtures/index.js';
import { LibraryPage } from '../../pages/library-page.js';
import { SignInPage } from '../../pages/sign-in-page.js';

test('member signs in', async ({ page }) => {
  const signInPage = new SignInPage(page);
  const libraryPage = new LibraryPage(page);
  await page.goto('/login');
  await signInPage.signIn(process.env.MEMBER_USERNAME!, process.env.MEMBER_PASSWORD!);
  await expect(page).toHaveURL('/library');
  await expect(libraryPage.accountMenu).toBeVisible();
});

test('admin signs in', async ({ page }) => {
  const signInPage = new SignInPage(page);
  const libraryPage = new LibraryPage(page);
  await page.goto('/login');
  await signInPage.signIn(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
  await expect(page).toHaveURL('/library');
  await expect(libraryPage.accountMenu).toBeVisible();
});
