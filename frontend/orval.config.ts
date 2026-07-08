import 'dotenv/config'
import { API_BASE_URL_ADAPTED } from './src/constants/api-url'
import { defineConfig } from 'orval'

if (!API_BASE_URL_ADAPTED) {
  throw new Error('please specify NEXT_PUBLIC_API_BASE_URL in .env file')
}

export default defineConfig({
  quiziset: {
    input: `${API_BASE_URL_ADAPTED}/api-docs-json`,
    output: {
      target: './src/generated-api-client/quiziset.ts',
      mode: 'tags',
      schemas: './src/generated-api-client/model',
      client: 'react-query',
      namingConvention: 'kebab-case',
      override: {
        mutator: {
          path: './src/utils/orval-custom-fetch/orval-custom-fetch.ts',
          name: 'customFetch',
        },
        query: {
          usePrefetch: true,
          mutationInvalidates: [
            {
              onMutations: ['createQuiz', 'updateQuiz', 'deleteQuiz'],
              invalidates: ['getAllQuizzes', 'getSingleQuiz'],
            },
            {
              onMutations: ['createReview', 'updateReview', 'deleteReview'],
              invalidates: [
                'getQuizReviews',
                'getSingleQuiz', // a review change also affects the quiz's averageRating
              ],
            },
            {
              onMutations: ['addFavorite', 'removeFavorite'],
              invalidates: ['getAllQuizzes', 'getSingleQuiz'],
            },
            {
              // refresh the current user profile (e.g. navbar avatar) after a profile change
              onMutations: ['updateMe'],
              invalidates: ['getMe'],
            },
          ],
        },
      },
      clean: true,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write src/generated-api-client',
    },
  },
})
