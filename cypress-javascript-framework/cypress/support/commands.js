const users = {
  member: ['MEMBER_USERNAME', 'MEMBER_PASSWORD'],
  admin: ['ADMIN_USERNAME', 'ADMIN_PASSWORD'],
};

Cypress.Commands.add('signIn', (user) => {
  const [usernameKey, passwordKey] = users[user];
  cy.session(
    user,
    () => {
      cy.env([usernameKey, passwordKey]).then((env) => {
        cy.request({
          method: 'POST',
          url: '/login',
          form: true,
          body: { username: env[usernameKey], password: env[passwordKey] },
          headers: { Origin: new URL(Cypress.config('baseUrl')).origin },
          followRedirect: false,
          log: false,
        }).then((response) => {
          if (response.headers.location !== '/library') {
            throw new Error(`Sign-in failed: POST /login returned ${response.status}, redirecting to ${response.headers.location}`);
          }
        });
      });
    },
    {
      cacheAcrossSpecs: true,
      validate() {
        cy.request({ url: '/account', followRedirect: false, log: false }).its('status').should('eq', 200);
      },
    },
  );
});
