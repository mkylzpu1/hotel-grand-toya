import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Astroファイル用
  ...eslintPluginAstro.configs.recommended,

  // TS/TSXファイル用
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Astro/Viteでは不要
      'react/prop-types': 'off', // TypeScriptで型チェックするので不要
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Prettierと競合するルールを無効化（必ず最後に置く）
  eslintConfigPrettier,

  // 無視対象
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'src/env.d.ts', 'docs/**'],
  },
];
