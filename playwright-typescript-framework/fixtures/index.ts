import AxeBuilder from '@axe-core/playwright';
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
  memberToken: string;
  axeViolations: () => Promise<string[]>;
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
  memberToken: async ({ request }, use) => {
    const response = await request.post('/api/tokens', {
      data: { username: member.username, password: member.password, name: `api-test-${Date.now()}`, expiresInDays: 1 },
    });
    if (response.status() !== 201) {
      throw new Error(`Token creation failed: POST /api/tokens returned ${response.status()}`);
    }
    const { token } = await response.json();
    await use(token);
    await request.post('/api/tokens/current', {
      data: { intent: 'revoke' },
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  axeViolations: async ({ page }, use) => {
    await use(async () => {
      await page.waitForFunction(
        () =>
          document.documentElement.dataset.hydrated === 'true' &&
          document
            .getAnimations()
            .every((animation) => animation.playState !== 'running' || !(animation.effect as KeyframeEffect | null)?.getKeyframes().some((frame) => 'opacity' in frame || 'transform' in frame)),
      );
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      return violations.map(
        (violation) =>
          `${violation.id} (${violation.impact}): ${violation.help} at ${violation.nodes
            .slice(0, 5)
            .map((node) => node.target.join(' '))
            .join(', ')}`,
      );
    });
  },
});

export { expect };
