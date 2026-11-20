import { test, expect, member } from '../../fixtures/index.js';

test('creating a shelf signed out is refused', async ({ request, baseURL }) => {
  const response = await request.post('/account/shelves/new', {
    data: { name: `api-test-${Date.now()}` },
    headers: { Origin: new URL(baseURL!).origin },
  });
  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ error: 'signed_out' });
});

test.describe('signed in', () => {
  test.use({ storageState: member.authFile });

  let shelfId: string | undefined;

  test.afterEach(async ({ request, baseURL }) => {
    if (shelfId) {
      await request.post(`/account/shelves/${shelfId}`, {
        data: { intent: 'delete' },
        headers: { Origin: new URL(baseURL!).origin },
      });
      shelfId = undefined;
    }
  });

  test('shelf lifecycle', async ({ request, baseURL }) => {
    const headers = { Origin: new URL(baseURL!).origin };
    const name = `api-test-${Date.now()}`;

    const created = await request.post('/account/shelves/new', { data: { name }, headers });
    expect(created.status()).toBe(201);
    const { shelf } = await created.json();
    shelfId = shelf.id;
    expect(shelf.name).toBe(name);

    const renamed = await request.post(`/account/shelves/${shelfId}`, { data: { name: `${name}-renamed` }, headers });
    expect(renamed.status()).toBe(200);
    expect((await renamed.json()).shelf.name).toBe(`${name}-renamed`);

    const deleted = await request.post(`/account/shelves/${shelfId}`, { data: { intent: 'delete' }, headers });
    expect(deleted.status()).toBe(200);
    expect(await deleted.json()).toEqual({ deleted: true });
    shelfId = undefined;
  });
});
