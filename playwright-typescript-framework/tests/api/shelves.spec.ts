import { test, expect } from '../../fixtures/index.js';

test('creating a shelf signed out is refused', async ({ request, baseURL }) => {
  const response = await request.post('/account/shelves/new', {
    data: { name: `api-test-${Date.now()}` },
    headers: { Origin: new URL(baseURL!).origin },
  });
  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ error: 'signed_out' });
});
