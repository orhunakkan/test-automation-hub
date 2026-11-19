export class BookPage {
  title() {
    return cy.get('[data-testid=book-title]');
  }

  startReading() {
    return cy.get('[data-testid=book-start-reading]');
  }
}
