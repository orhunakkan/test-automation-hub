describe('shelves', () => {
  const headers = { Origin: new URL(Cypress.config('baseUrl')).origin };
  let shelfId;

  afterEach(() => {
    if (shelfId) {
      cy.request({ method: 'POST', url: `/account/shelves/${shelfId}`, body: { intent: 'delete' }, headers, failOnStatusCode: false });
      shelfId = undefined;
    }
  });

  it('creating a shelf signed out is refused', () => {
    cy.request({
      method: 'POST',
      url: '/account/shelves/new',
      body: { name: `api-test-${Date.now()}` },
      headers,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.deep.eq({ error: 'signed_out' });
    });
  });

  it('shelf lifecycle', () => {
    const name = `api-test-${Date.now()}`;
    cy.signIn('member');
    cy.request({ method: 'POST', url: '/account/shelves/new', body: { name }, headers })
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.shelf.name).to.eq(name);
        shelfId = response.body.shelf.id;
        return cy.request({ method: 'POST', url: `/account/shelves/${shelfId}`, body: { name: `${name}-renamed` }, headers });
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.shelf.name).to.eq(`${name}-renamed`);
        return cy.request({ method: 'POST', url: `/account/shelves/${shelfId}`, body: { intent: 'delete' }, headers });
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.eq({ deleted: true });
        shelfId = undefined;
      });
  });

  describe('with a token', () => {
    let token;
    let tokenShelfId;

    afterEach(() => {
      if (tokenShelfId) {
        cy.request({ method: 'POST', url: `/account/shelves/${tokenShelfId}`, body: { intent: 'delete' }, headers: { Authorization: `Bearer ${token}` }, failOnStatusCode: false });
        tokenShelfId = undefined;
      }
      if (token) {
        cy.revokeToken(token);
        token = undefined;
      }
    });

    it('shelf lifecycle with a token', () => {
      const name = `api-test-${Date.now()}`;
      cy.createToken('member')
        .then((created) => {
          token = created;
          return cy.request({ method: 'POST', url: '/account/shelves/new', body: { name }, headers: { Authorization: `Bearer ${token}` } });
        })
        .then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.shelf.name).to.eq(name);
          tokenShelfId = response.body.shelf.id;
          return cy.request({ method: 'POST', url: `/account/shelves/${tokenShelfId}`, body: { name: `${name}-renamed` }, headers: { Authorization: `Bearer ${token}` } });
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.shelf.name).to.eq(`${name}-renamed`);
          return cy.request({ method: 'POST', url: `/account/shelves/${tokenShelfId}`, body: { intent: 'delete' }, headers: { Authorization: `Bearer ${token}` } });
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.eq({ deleted: true });
          tokenShelfId = undefined;
        });
    });
  });
});
