import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import prettierPlugin from 'eslint-plugin-prettier'

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
      prettier: prettierPlugin,
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

      'prettier/prettier': ['warn', { endOfLine: 'auto' }],
    },
  },

  {
    files: ['**/index.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
])

export default eslintConfig
