import 'dotenv/config'
import { defineConfig } from 'orval'

const { API_BASE_URL, API_OPENAPI_JSON_URL } = process.env

if (!API_BASE_URL || !API_OPENAPI_JSON_URL) {
  throw new Error('please specify API_BASE_URL & API_OPENAPI_JSON_URL in .env file');
}

export default defineConfig({
  quiziset: {
    input: API_OPENAPI_JSON_URL,
    output: {
      target: './src/api-client/quiziset.ts',
      baseUrl: API_BASE_URL,
      mode: 'tags',
      schemas: './src/api-client/model',
      client: 'react-query',
      namingConvention: 'kebab-case',
      override: {
        fetch: {
          forceSuccessResponse: true
        }
      }
    },
  },
})
