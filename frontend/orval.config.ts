import 'dotenv/config'
import { defineConfig } from 'orval'

const { API_OPENAPI_JSON_URL } = process.env

if (!API_OPENAPI_JSON_URL) {
  throw new Error('please specify API_OPENAPI_JSON_URL in .env file');
}

export default defineConfig({
  quiziset: {
    input: API_OPENAPI_JSON_URL,
    hooks: {
      /**
       * For more info regarding the purpose of this hook
       * 
       * --> check the code comments I wrote in:
       * - fix-generated-types.js
       * - orval-custom-fetch.ts
       */
      afterAllFilesWrite: 'node scripts/fix-generated-types.js',
    },
    output: {
      target: './src/api-client/quiziset.ts',
      mode: 'tags',
      schemas: './src/api-client/model',
      client: 'react-query',
      namingConvention: 'kebab-case',
      override: {
        mutator: {
          path: './src/utils/orval-custom-fetch.ts',
          name: 'customFetch',
        },
      }
    },
  },
})
