import pluginCypress from 'eslint-plugin-cypress';
import globals from 'globals';

const useTestId = "Locate elements by data-testid: cy.get('[data-testid=…]').";

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
      'no-restricted-properties': ['error', { object: 'cy', property: 'contains', message: useTestId }, { object: 'cy', property: 'getByRole', message: useTestId }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='cy'][callee.property.name='get'] > Literal.arguments:first-child[value=/^(?!\\[data-testid=|@)/]",
          message: useTestId,
        },
      ],
    },
  },
];
