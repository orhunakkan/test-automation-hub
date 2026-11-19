export class ReaderPage {
  pageLabel() {
    return cy.get('[data-testid=reader-page-label]');
  }

  nextPage() {
    return cy.get('[data-testid=reader-next-page]');
  }
}
