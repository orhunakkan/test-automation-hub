describe('login', () => {
  it('sign-in without an Origin header is refused', () => {
    cy.request({ method: 'POST', url: '/login', failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });
});
