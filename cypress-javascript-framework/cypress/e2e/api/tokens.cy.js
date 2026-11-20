describe('tokens', () => {
  let token;

  afterEach(() => {
    if (token) {
      cy.request({ method: 'POST', url: '/api/tokens/current', body: { intent: 'revoke' }, headers: { Authorization: `Bearer ${token}` }, failOnStatusCode: false, log: false });
      token = undefined;
    }
  });

  it('member creates a token', () => {
    cy.env(['MEMBER_USERNAME', 'MEMBER_PASSWORD']).then(({ MEMBER_USERNAME, MEMBER_PASSWORD }) => {
      cy.request({
        method: 'POST',
        url: '/api/tokens',
        body: { username: MEMBER_USERNAME, password: MEMBER_PASSWORD, name: `api-test-${Date.now()}`, expiresInDays: 1 },
        log: false,
      }).then((response) => {
        expect(response.status).to.eq(201);
        token = response.body.token;
        expect(response.body.token).to.match(/^folio_at_/);
        expect(response.body.tokenType).to.eq('Bearer');
      });
    });
  });
});
