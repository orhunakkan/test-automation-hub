export class SignInPage {
  username() {
    return cy.get('[data-testid=username]');
  }

  password() {
    return cy.get('[data-testid=password]');
  }

  submit() {
    return cy.get('[data-testid=sign-in]');
  }

  error() {
    return cy.get('[data-testid=sign-in-error]');
  }

  signIn(username, password) {
    this.username().type(username, { log: false });
    this.password().type(password, { log: false });
    this.submit().click();
  }
}
