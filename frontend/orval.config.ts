import 'dotenv/config'
import { API_BASE_URL } from './src/constants/api-url'
import { defineConfig } from 'orval'

if (!API_BASE_URL) {
  throw new Error('please specify NEXT_PUBLIC_API_BASE_URL in .env file')
}

export default defineConfig({
  quiziset: {
    input: `${API_BASE_URL}/api-docs-json`,
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
        query: {
          usePrefetch: true,
          mutationInvalidates: [
            {
              onMutations: ['createQuiz', 'updateQuiz', 'deleteQuiz'],
              invalidates: ['getAllQuizzes', 'getSingleQuiz'],
            },
          ],
        },
      },
      clean: true,
    },
  },
})
