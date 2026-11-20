describe('me', () => {
  let token;

  afterEach(() => {
    if (token) {
      cy.revokeToken(token);
      token = undefined;
    }
  });

  it('who am I by cookie', () => {
    cy.signIn('member');
    cy.env(['MEMBER_USERNAME']).then(({ MEMBER_USERNAME }) => {
      cy.request('/api/me').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include({ username: MEMBER_USERNAME, via: 'cookie' });
      });
    });
  });

  it('who am I by token', () => {
    cy.createToken('member').then((created) => {
      token = created;
      cy.env(['MEMBER_USERNAME']).then(({ MEMBER_USERNAME }) => {
        cy.request({ url: '/api/me', headers: { Authorization: `Bearer ${token}` } }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.include({ username: MEMBER_USERNAME, via: 'token' });
        });
      });
    });
  });
});
