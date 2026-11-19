import { test as setup, member, admin } from '../fixtures/index.js';

setup('sign in the member', async ({ context, signIn }) => {
  await signIn(member);
  await context.storageState({ path: member.authFile });
});

setup('sign in the admin', async ({ context, signIn }) => {
  await signIn(admin);
  await context.storageState({ path: admin.authFile });
});
