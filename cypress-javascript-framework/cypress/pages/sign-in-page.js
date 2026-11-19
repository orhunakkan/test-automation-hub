export class SignInPage {
  username() {
    return cy.getByRole('textbox', { name: 'Username' });
  }

  password() {
    return cy.get('[data-testid=password]');
  }

  submit() {
    return cy.getByRole('button', { name: 'Sign in' });
  }

  signIn(username, password) {
    this.username().type(username, { log: false });
    this.password().type(password, { log: false });
    this.submit().click();
  }
}
