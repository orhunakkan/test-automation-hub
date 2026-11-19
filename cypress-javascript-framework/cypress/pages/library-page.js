export class LibraryPage {
  heading() {
    return cy.getByRole('heading', { name: 'Library' });
  }

  accountMenu() {
    return cy.get('[data-testid=account-menu]').filter(':visible');
  }
}
