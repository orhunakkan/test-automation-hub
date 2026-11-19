import { test, expect, member, admin } from '../../fixtures/index.js';
import { LibraryPage } from '../../pages/library-page.js';
import { SignInPage } from '../../pages/sign-in-page.js';

test('member signs in', async ({ page }) => {
  const signInPage = new SignInPage(page);
  const libraryPage = new LibraryPage(page);
  await page.goto('/login');
  await signInPage.signIn(member.username, member.password);
  await expect(page).toHaveURL('/library');
  await expect(libraryPage.accountMenu).toBeVisible();
});

test('admin signs in', async ({ page }) => {
  const signInPage = new SignInPage(page);
  const libraryPage = new LibraryPage(page);
  await page.goto('/login');
  await signInPage.signIn(admin.username, admin.password);
  await expect(page).toHaveURL('/library');
  await expect(libraryPage.accountMenu).toBeVisible();
});

test('wrong password is refused', async ({ page }) => {
  const signInPage = new SignInPage(page);
  await page.goto('/login');
  await signInPage.signIn('e2e-no-such-user', 'not-the-password');
  await expect(signInPage.error).toHaveText('Username or password is incorrect.');
});
