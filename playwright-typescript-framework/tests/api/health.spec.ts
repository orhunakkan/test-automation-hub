import { test, expect } from '../../fixtures/index.js';

test('health check answers ok', async ({ request }) => {
  const response = await request.get('/healthz');
  expect(response.status()).toBe(200);
  expect(await response.text()).toBe('ok');
});
