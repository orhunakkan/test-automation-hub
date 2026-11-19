import { LibraryPage } from '../../pages/library-page.js';
import { SignInPage } from '../../pages/sign-in-page.js';

const users = [
  { role: 'member', usernameKey: 'MEMBER_USERNAME', passwordKey: 'MEMBER_PASSWORD' },
  { role: 'admin', usernameKey: 'ADMIN_USERNAME', passwordKey: 'ADMIN_PASSWORD' },
];

describe('sign in', () => {
  users.forEach((user) => {
    it(`${user.role} signs in`, () => {
      const signInPage = new SignInPage();
      const libraryPage = new LibraryPage();
      cy.visit('/login');
      cy.env([user.usernameKey, user.passwordKey]).then((env) => {
        signInPage.signIn(env[user.usernameKey], env[user.passwordKey]);
      });
      cy.location('pathname').should('eq', '/library');
      libraryPage.accountMenu().should('be.visible');
    });
  });
});
