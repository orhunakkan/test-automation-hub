export class LibraryPage {
  open() {
    cy.visit('/library');
    cy.document().its('documentElement.dataset.hydrated');
  }

  heading() {
    return cy.get('[data-testid=library-title]');
  }

  searchBox() {
    return cy.get('[data-testid=library-search]');
  }

  count() {
    return cy.get('[data-testid=library-count]');
  }

  books() {
    return cy.get('[data-testid=book-card]');
  }

  search(query) {
    this.searchBox().type(query);
  }

  book(slug) {
    return cy.get(`[data-testid=book-card][data-key=${slug}]`);
  }

  accountMenu() {
    return cy.get('[data-testid=account-menu]').filter(':visible');
  }

  signOutButton() {
    return cy.get('[data-testid=account-sign-out]').filter(':visible');
  }

  signInLink() {
    return cy.get('[data-testid=sign-in-link]').filter(':visible');
  }

  signOut() {
    this.accountMenu().click();
    this.signOutButton().click();
  }
}
