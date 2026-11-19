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

  it('search finds a book', () => {
    const libraryPage = new LibraryPage();
    libraryPage.open();
    libraryPage.search('pride');
    libraryPage.searchBox().should('have.value', 'pride');
    libraryPage.book('pride-and-prejudice').should('be.visible');
    libraryPage.count().should('have.text', 'Showing 1 book');
  });

  it('search with no match', () => {
    const libraryPage = new LibraryPage();
    libraryPage.open();
    libraryPage.search('zyxwvq');
    libraryPage.searchBox().should('have.value', 'zyxwvq');
    libraryPage.books().should('not.exist');
    libraryPage.count().should('have.text', 'Showing 0 books');
  });
});
