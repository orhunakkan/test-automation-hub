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

test('revoked token is refused', async ({ request, memberToken }) => {
  const headers = { Authorization: `Bearer ${memberToken}` };
  const revoked = await request.post('/api/tokens/current', { data: { intent: 'revoke' }, headers });
  expect(revoked.status()).toBe(200);
  expect(await revoked.json()).toMatchObject({ revoked: true });
  const me = await request.get('/api/me', { headers });
  expect(me.status()).toBe(401);
  expect(me.headers()['www-authenticate']).toBe('Bearer error="invalid_token"');
});
