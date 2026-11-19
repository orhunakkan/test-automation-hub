import { LibraryPage } from '../../pages/library-page.js';

describe('sign out', () => {
  it('member signs out', () => {
    const libraryPage = new LibraryPage();
    cy.signIn('member');
    cy.visit('/library');
    libraryPage.signOut();
    libraryPage.signInLink().should('be.visible');
  });

  it('admin signs out', () => {
    const libraryPage = new LibraryPage();
    cy.signIn('admin');
    cy.visit('/library');
    libraryPage.signOut();
    libraryPage.signInLink().should('be.visible');
  });
});
