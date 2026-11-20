describe('login', () => {
  it('sign-in without an Origin header is refused', () => {
    cy.request({ method: 'POST', url: '/login', failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });

  it('member signs in', () => {
    cy.env(['MEMBER_USERNAME', 'MEMBER_PASSWORD']).then(({ MEMBER_USERNAME, MEMBER_PASSWORD }) => {
      cy.request({
        method: 'POST',
        url: '/login',
        form: true,
        body: { username: MEMBER_USERNAME, password: MEMBER_PASSWORD },
        headers: { Origin: new URL(Cypress.config('baseUrl')).origin },
        followRedirect: false,
        log: false,
      }).then((response) => {
        expect(response.status).to.eq(303);
        expect(response.headers.location).to.eq('/library');
        expect(response.headers['set-cookie'][0]).to.match(/^__Host-session=/);
      });
    });
  });
});
