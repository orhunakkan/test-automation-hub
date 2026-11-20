export class ReaderPage {
  open(path) {
    cy.visit(path);
    cy.document().its('documentElement.dataset.hydrated');
  }

  pageLabel() {
    return cy.get('[data-testid=reader-page-label]');
  }

  nextPage() {
    return cy.get('[data-testid=reader-next-page]');
  }

  contentsButton() {
    return cy.get('[data-testid=reader-contents]');
  }

  contentsDrawer() {
    return cy.get('[data-testid=contents-drawer]');
  }

  contentsClose() {
    return cy.get('[data-testid=contents-close]');
  }

  openContents() {
    this.contentsButton().click();
  }
}
