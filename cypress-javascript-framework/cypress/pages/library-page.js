export class LibraryPage {
  heading() {
    return cy.get('[data-testid=library-title]');
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
