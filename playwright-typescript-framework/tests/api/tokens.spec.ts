import { test, expect, member } from '../../fixtures/index.js';

let token: string | undefined;

test.afterEach(async ({ request }) => {
  if (token) {
    await request.post('/api/tokens/current', {
      data: { intent: 'revoke' },
      headers: { Authorization: `Bearer ${token}` },
    });
    token = undefined;
  }
});

test('member creates a token', async ({ request }) => {
  const response = await request.post('/api/tokens', {
    data: { username: member.username, password: member.password, name: `api-test-${Date.now()}`, expiresInDays: 1 },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  token = body.token;
  expect(body.token).toMatch(/^folio_at_/);
  expect(body.tokenType).toBe('Bearer');
});
