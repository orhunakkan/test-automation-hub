import { test, expect, member, admin } from '../../fixtures/index.js';

test('sign-in without an Origin header is refused', async ({ request }) => {
  const response = await request.post('/login');
  expect(response.status()).toBe(403);
});

test('member signs in', async ({ request, baseURL }) => {
  const response = await request.post('/login', {
    form: { username: member.username, password: member.password },
    headers: { Origin: new URL(baseURL!).origin },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(303);
  expect(response.headers()['location']).toBe('/library');
  expect(response.headers()['set-cookie']).toContain('__Host-session=');
});

test('admin signs in', async ({ request, baseURL }) => {
  const response = await request.post('/login', {
    form: { username: admin.username, password: admin.password },
    headers: { Origin: new URL(baseURL!).origin },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(303);
  expect(response.headers()['location']).toBe('/library');
  expect(response.headers()['set-cookie']).toContain('__Host-session=');
});
