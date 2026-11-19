import { LibraryPage } from '../../pages/library-page.js';
import { SignInPage } from '../../pages/sign-in-page.js';

describe('sign in', () => {
  it('member signs in', () => {
    const signInPage = new SignInPage();
    const libraryPage = new LibraryPage();
    cy.visit('/login');
    cy.env(['MEMBER_USERNAME', 'MEMBER_PASSWORD']).then(({ MEMBER_USERNAME, MEMBER_PASSWORD }) => {
      signInPage.signIn(MEMBER_USERNAME, MEMBER_PASSWORD);
    });
    cy.location('pathname').should('eq', '/library');
    libraryPage.accountMenu().should('be.visible');
  });

  it('admin signs in', () => {
    const signInPage = new SignInPage();
    const libraryPage = new LibraryPage();
    cy.visit('/login');
    cy.env(['ADMIN_USERNAME', 'ADMIN_PASSWORD']).then(({ ADMIN_USERNAME, ADMIN_PASSWORD }) => {
      signInPage.signIn(ADMIN_USERNAME, ADMIN_PASSWORD);
    });
    cy.location('pathname').should('eq', '/library');
    libraryPage.accountMenu().should('be.visible');
  });

  it('wrong password is refused', () => {
    const signInPage = new SignInPage();
    cy.visit('/login');
    signInPage.signIn('e2e-no-such-user', 'not-the-password');
    signInPage.error().should('have.text', 'Username or password is incorrect.');
    cy.location('pathname').should('eq', '/login');
  });
});
