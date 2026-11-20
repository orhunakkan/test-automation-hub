import { test, expect, member } from '../../fixtures/index.js';

test.describe('by cookie', () => {
  test.use({ storageState: member.authFile });

  test('who am I by cookie', async ({ request }) => {
    const response = await request.get('/api/me');
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ username: member.username, via: 'cookie' });
  });
});

test('who am I by token', async ({ request, memberToken }) => {
  const response = await request.get('/api/me', { headers: { Authorization: `Bearer ${memberToken}` } });
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ username: member.username, via: 'token' });
});
