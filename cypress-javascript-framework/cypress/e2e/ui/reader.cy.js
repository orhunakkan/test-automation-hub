import { BookPage } from '../../pages/book-page.js';
import { ReaderPage } from '../../pages/reader-page.js';

describe('reader', () => {
  it('start reading', () => {
    const bookPage = new BookPage();
    const readerPage = new ReaderPage();
    cy.visit('/library/jane-austen/pride-and-prejudice');
    bookPage.startReading().click();
    readerPage.pageLabel().should('contain.text', 'Chapter 1 · Page 1 of');
  });

  it('turn a page', () => {
    const readerPage = new ReaderPage();
    cy.visit('/read/pride-and-prejudice/chapter-1');
    readerPage.pageLabel().should('contain.text', 'Chapter 1 · Page 1 of');
    readerPage.nextPage().click();
    readerPage.pageLabel().should('contain.text', 'Chapter 1 · Page 2 of');
  });
});
