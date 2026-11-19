import pluginCypress from 'eslint-plugin-cypress';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/', 'cypress/screenshots/', 'cypress/videos/', 'cypress/downloads/', '.claude/'],
  },
  { languageOptions: { globals: globals.node } },
  pluginCypress.configs.recommended,
  {
    rules: {
      'cypress/require-data-selectors': 'error',
      'cypress/no-xpath': 'error',
    },
  },
];
