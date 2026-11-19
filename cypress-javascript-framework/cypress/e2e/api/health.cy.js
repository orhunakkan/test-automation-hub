describe('health', () => {
  it('health check answers ok', () => {
    cy.request('/healthz').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq('ok');
    });
  });
});
