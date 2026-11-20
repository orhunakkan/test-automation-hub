import { test, expect, member } from '../../fixtures/index.js';
import { AccountPage } from '../../pages/account-page.js';
import { BookPage } from '../../pages/book-page.js';
import { LibraryPage } from '../../pages/library-page.js';
import { ReaderPage } from '../../pages/reader-page.js';
import { SignInPage } from '../../pages/sign-in-page.js';

test('library is accessible', async ({ page, axeViolations }) => {
  const libraryPage = new LibraryPage(page);
  await libraryPage.open();
  await expect(libraryPage.heading).toBeVisible();
  expect(await axeViolations()).toEqual([]);
});

test('book page is accessible', async ({ page, axeViolations }) => {
  const bookPage = new BookPage(page);
  await page.goto('/library/jane-austen/pride-and-prejudice');
  await expect(bookPage.title).toHaveText('Pride and Prejudice');
  expect(await axeViolations()).toEqual([]);
});

test('reader is accessible', async ({ page, axeViolations }) => {
  const readerPage = new ReaderPage(page);
  await readerPage.open('/read/pride-and-prejudice/chapter-1');
  await expect(readerPage.pageLabel).toContainText('Chapter 1 · Page 1 of');
  expect(await axeViolations()).toEqual([]);
});

test('sign-in page is accessible', async ({ page, axeViolations }) => {
  const signInPage = new SignInPage(page);
  await page.goto('/login');
  await expect(signInPage.submit).toBeVisible();
  expect(await axeViolations()).toEqual([]);
});

test('sign-in error is accessible', async ({ page, axeViolations }) => {
  const signInPage = new SignInPage(page);
  await page.goto('/login');
  await signInPage.signIn('e2e-no-such-user', 'not-the-password');
  await expect(signInPage.error).toHaveText('Username or password is incorrect.');
  expect(await axeViolations()).toEqual([]);
});

test.describe('signed in', () => {
  test.use({ storageState: member.authFile });

  test('signed-in library is accessible', async ({ page, axeViolations }) => {
    const libraryPage = new LibraryPage(page);
    await libraryPage.open();
    await expect(libraryPage.signInLink).toHaveCount(0);
    expect(await axeViolations()).toEqual([]);
  });

  test('account page is accessible', async ({ page, axeViolations }) => {
    const accountPage = new AccountPage(page);
    await accountPage.open();
    await expect(page).toHaveURL('/account');
    await expect(accountPage.title).toBeVisible();
    expect(await axeViolations()).toEqual([]);
  });
});
