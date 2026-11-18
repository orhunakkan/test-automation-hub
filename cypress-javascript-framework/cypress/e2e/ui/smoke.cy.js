describe('smoke', () => {
  it('home page loads', () => {
    cy.visit('/');
    cy.title().should('include', 'Folio');
  });
});
