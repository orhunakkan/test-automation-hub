import { defineConfig, globalIgnores } from 'eslint/config';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default defineConfig(globalIgnores(['node_modules/', 'playwright-report/', 'test-results/', 'blob-report/', '.claude/']), tseslint.configs.recommended, {
  files: ['tests/**', 'pages/**', 'fixtures/**'],
  extends: [playwright.configs['flat/recommended']],
  rules: {
    'playwright/no-raw-locators': 'error',
    'playwright/expect-expect': ['warn', { assertFunctionNames: ['signIn'] }],
  },
});
