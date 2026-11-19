import { test as base, expect } from '@playwright/test';

export type User = { username: string; password: string; authFile: string };

export const member: User = {
  username: process.env.MEMBER_USERNAME!,
  password: process.env.MEMBER_PASSWORD!,
  authFile: 'playwright/.auth/member.json',
};

export const admin: User = {
  username: process.env.ADMIN_USERNAME!,
  password: process.env.ADMIN_PASSWORD!,
  authFile: 'playwright/.auth/admin.json',
};

type Fixtures = {
  signIn: (user: User) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  signIn: async ({ context, baseURL }, use) => {
    await use(async (user) => {
      const response = await context.request.post('/login', {
        form: { username: user.username, password: user.password },
        headers: { Origin: new URL(baseURL!).origin },
        maxRedirects: 0,
      });
      const location = response.headers()['location'];
      if (location !== '/library') {
        throw new Error(`Sign-in failed: POST /login returned ${response.status()}, redirecting to ${location}`);
      }
    });
  },
});

export { expect };
