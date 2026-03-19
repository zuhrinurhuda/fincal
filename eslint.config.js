import eslintPluginAstro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser: tsParser },
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
      ...jsxA11y.configs.recommended.rules,
    },
  },
  eslintConfigPrettier,
];
