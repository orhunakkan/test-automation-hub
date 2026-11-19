import { BookPage } from '../../pages/book-page.js';
import { LibraryPage } from '../../pages/library-page.js';

describe('library', () => {
  it('library loads', () => {
    const libraryPage = new LibraryPage();
    cy.visit('/library');
    libraryPage.heading().should('be.visible').and('have.text', 'Library');
  });

  it('library opens a book', () => {
    const libraryPage = new LibraryPage();
    const bookPage = new BookPage();
    cy.visit('/library');
    libraryPage.book('pride-and-prejudice').click();
    bookPage.title().should('have.text', 'Pride and Prejudice');
    bookPage.startReading().should('have.text', 'Start reading');
  });
});
