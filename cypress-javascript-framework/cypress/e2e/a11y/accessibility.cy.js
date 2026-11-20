import { AccountPage } from '../../pages/account-page.js';
import { BookPage } from '../../pages/book-page.js';
import { LibraryPage } from '../../pages/library-page.js';
import { ReaderPage } from '../../pages/reader-page.js';
import { SignInPage } from '../../pages/sign-in-page.js';

describe('accessibility', () => {
  it('library is accessible', () => {
    const libraryPage = new LibraryPage();
    libraryPage.open();
    libraryPage.heading().should('be.visible');
    cy.axeViolations().should('deep.equal', []);
  });

  it('book page is accessible', () => {
    const bookPage = new BookPage();
    cy.visit('/library/jane-austen/pride-and-prejudice');
    bookPage.title().should('have.text', 'Pride and Prejudice');
    cy.axeViolations().should('deep.equal', []);
  });

  it('reader is accessible', () => {
    const readerPage = new ReaderPage();
    readerPage.open('/read/pride-and-prejudice/chapter-1');
    readerPage.pageLabel().should('contain.text', 'Chapter 1 · Page 1 of');
    cy.axeViolations().should('deep.equal', []);
  });

  it('sign-in page is accessible', () => {
    const signInPage = new SignInPage();
    signInPage.open();
    signInPage.submit().should('be.visible');
    cy.axeViolations().should('deep.equal', []);
  });

  it('sign-in error is accessible', () => {
    const signInPage = new SignInPage();
    signInPage.open();
    signInPage.signIn('e2e-no-such-user', 'not-the-password');
    signInPage.error().should('have.text', 'Username or password is incorrect.');
    cy.axeViolations().should('deep.equal', []);
  });

  it('signed-in library is accessible', () => {
    const libraryPage = new LibraryPage();
    cy.signIn('member');
    libraryPage.open();
    libraryPage.accountMenu().should('be.visible');
    cy.axeViolations().should('deep.equal', []);
  });

  it('account page is accessible', () => {
    const accountPage = new AccountPage();
    cy.signIn('member');
    accountPage.open();
    cy.location('pathname').should('eq', '/account');
    accountPage.title().should('be.visible');
    cy.axeViolations().should('deep.equal', []);
  });
});
