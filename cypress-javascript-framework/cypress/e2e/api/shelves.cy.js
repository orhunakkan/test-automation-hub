describe('shelves', () => {
  it('creating a shelf signed out is refused', () => {
    cy.request({
      method: 'POST',
      url: '/account/shelves/new',
      body: { name: `api-test-${Date.now()}` },
      headers: { Origin: new URL(Cypress.config('baseUrl')).origin },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.deep.eq({ error: 'signed_out' });
    });
  });
});
