import { LibraryPage } from '../../pages/library-page.js';

describe('library', () => {
  it('library loads', () => {
    const libraryPage = new LibraryPage();
    cy.visit('/library');
    libraryPage.heading().should('be.visible').and('have.text', 'Library');
  });
});
