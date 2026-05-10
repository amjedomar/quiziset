import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import unicorn from 'eslint-plugin-unicorn'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    plugins: {
      unicorn,
    },

    rules: {
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['../*', './*'],
              message: 'Use @/ imports instead of relative imports',
            },
          ],
        },
      ],

      'unicorn/filename-case': [
        'warn',
        {
          case: 'kebabCase',
        },
      ],
    },
  },

  {
    files: ['**/index.ts', 'src/api-client/**/*'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
])

export default eslintConfig
