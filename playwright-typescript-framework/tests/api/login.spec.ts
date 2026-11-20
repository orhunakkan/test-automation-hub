import { test, expect } from '../../fixtures/index.js';

test('sign-in without an Origin header is refused', async ({ request }) => {
  const response = await request.post('/login');
  expect(response.status()).toBe(403);
});
