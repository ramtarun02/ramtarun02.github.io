import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

/**
 * Flat config using @next/eslint-plugin-next directly rather than
 * eslint-config-next, whose legacy @rushstack patch breaks on ESLint 9.39+.
 */
export default tseslint.config(
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'test-results/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { '@next/next': nextPlugin, 'react-hooks': reactHooks },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  prettier,
);
