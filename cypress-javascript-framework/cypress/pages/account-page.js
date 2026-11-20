export class AccountPage {
  open() {
    cy.visit('/account');
    cy.document().its('documentElement.dataset.hydrated');
  }

  title() {
    return cy.get('[data-testid=account-title]');
  }
}
