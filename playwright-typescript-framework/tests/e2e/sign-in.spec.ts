import { test, expect } from '../../fixtures/index.js';
import { LibraryPage } from '../../pages/library-page.js';
import { SignInPage } from '../../pages/sign-in-page.js';

const users = [
  { role: 'member', username: process.env.MEMBER_USERNAME!, password: process.env.MEMBER_PASSWORD! },
  { role: 'admin', username: process.env.ADMIN_USERNAME!, password: process.env.ADMIN_PASSWORD! },
];

for (const user of users) {
  test(`${user.role} signs in`, async ({ page }) => {
    const signInPage = new SignInPage(page);
    const libraryPage = new LibraryPage(page);
    await page.goto('/login');
    await signInPage.signIn(user.username, user.password);
    await expect(page).toHaveURL('/library');
    await expect(libraryPage.accountMenu).toBeVisible();
  });
}
