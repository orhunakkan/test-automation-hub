import { existsSync } from 'node:fs';
import { defineConfig } from 'cypress';

if (existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL ?? 'https://dev.agenticlibrary.app',
  },
  env: {
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    MEMBER_USERNAME: process.env.MEMBER_USERNAME,
    MEMBER_PASSWORD: process.env.MEMBER_PASSWORD,
  },
});
