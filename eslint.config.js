import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import storybook from 'eslint-plugin-storybook';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'coverage',
      'storybook-static',
      'node_modules',
      'public/mockServiceWorker.js',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.strict,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Prefer a function with early returns; a nested ternary hides which
      // branch you are in, especially inside JSX.
      'no-nested-ternary': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
      'jsx-a11y/no-autofocus': 'error',
    },
  },
  {
    files: [
      'src/design-system/**/*.{ts,tsx}',
      'src/domains/*/components/**/*.{ts,tsx}',
    ],
    ignores: ['**/*.test.{ts,tsx}', '**/*.stories.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-router',
              message:
                'Presentational components must not access the router. Lift routing into a page or hook.',
            },
            {
              name: '@tanstack/react-query',
              message:
                'Presentational components must not access React Query. Pass data in through props.',
            },
            {
              name: 'zustand',
              message:
                'Presentational components must not access global stores. Pass state in through props.',
            },
          ],
          patterns: [
            {
              group: ['**/api/**', '**/queries/**'],
              message:
                'Presentational components must not reach into the data layer.',
            },
          ],
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'import',
          property: 'meta',
          message:
            'Presentational components must not read import.meta.env. Read configuration in src/shared/config.',
        },
      ],
    },
  },
  {
    files: ['src/design-system/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/domains/*', '**/domains/**'],
              message:
                'The design system must stay domain independent. Move domain aware code into the domain.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/shared/test/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.config.{ts,js}', '.storybook/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  ...storybook.configs['flat/recommended'],
);
