import { LibraryPage } from '../../pages/library-page.js';

describe('sign out', () => {
  it('member signs out', () => {
    const libraryPage = new LibraryPage();
    cy.signIn('member');
    libraryPage.open();
    libraryPage.signOut();
    libraryPage.signInLink().should('be.visible');
  });

  it('admin signs out', () => {
    const libraryPage = new LibraryPage();
    cy.signIn('admin');
    libraryPage.open();
    libraryPage.signOut();
    libraryPage.signInLink().should('be.visible');
  });
});
