export class LibraryPage {
  heading() {
    return cy.get('[data-testid=library-title]');
  }

  accountMenu() {
    return cy.get('[data-testid=account-menu]').filter(':visible');
  }
}
