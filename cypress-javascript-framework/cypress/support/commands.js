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

Cypress.Commands.add('createToken', (user) => {
  const [usernameKey, passwordKey] = users[user];
  cy.env([usernameKey, passwordKey]).then((env) => {
    cy.request({
      method: 'POST',
      url: '/api/tokens',
      body: { username: env[usernameKey], password: env[passwordKey], name: `api-test-${Date.now()}`, expiresInDays: 1 },
      failOnStatusCode: false,
      log: false,
    }).then((response) => {
      if (response.status !== 201) {
        throw new Error(`Token creation failed: POST /api/tokens returned ${response.status}`);
      }
      return response.body.token;
    });
  });
});

Cypress.Commands.add('revokeToken', (token) => {
  cy.request({
    method: 'POST',
    url: '/api/tokens/current',
    body: { intent: 'revoke' },
    headers: { Authorization: `Bearer ${token}` },
    failOnStatusCode: false,
    log: false,
  });
});

const isFadeOrSlide = (animation) => animation.playState === 'running' && animation.effect?.getKeyframes().some((frame) => 'opacity' in frame || 'transform' in frame);

Cypress.Commands.add('axeViolations', () => {
  cy.document().its('documentElement.dataset.hydrated');
  cy.document().then((document) =>
    Promise.all(
      document
        .getAnimations()
        .filter(isFadeOrSlide)
        .map((animation) => animation.finished),
    ),
  );
  cy.readFile('node_modules/axe-core/axe.min.js', { log: false })
    .then((source) =>
      cy.window().then({ timeout: 30000 }, (win) => {
        win.eval(source);
        return win.axe.run(win.document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
      }),
    )
    .then(({ violations }) =>
      violations.map(
        (violation) =>
          `${violation.id} (${violation.impact}): ${violation.help} at ${violation.nodes
            .slice(0, 5)
            .map((node) => node.target.join(' '))
            .join(', ')}`,
      ),
    );
});
