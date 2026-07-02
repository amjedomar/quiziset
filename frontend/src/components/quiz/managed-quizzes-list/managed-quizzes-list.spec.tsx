import { render } from '@testing-library/react'
import { makeQuiz } from '@/test-utils/mocks'
import { ManagedQuizzesList } from './managed-quizzes-list'

jest.mock('@/constants/api-url', () => ({
  NEXT_PUBLIC_API_BASE_URL: 'http://mock-backend',
}))

jest.mock('@/components/quiz/favorite-button', () => ({
  FavoriteButton: () => null,
}))

const useQuizzesQuery = jest.fn()
jest.mock('@/hooks/use-quizzes-query', () => ({
  useQuizzesQuery: (params: unknown) => useQuizzesQuery(params),
}))

describe('ManagedQuizzesList', () => {
  it('correctly renders', () => {
    useQuizzesQuery.mockReturnValue({
      quizzes: [makeQuiz()],
      totalMatches: 1,
      totalPages: 1,
      isLoading: false,
      error: null,
    })

    const { asFragment } = render(<ManagedQuizzesList />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders each managed quiz with links to update and view its analytics', () => {
    useQuizzesQuery.mockReturnValue({
      quizzes: [makeQuiz({ id: 5 })],
      totalMatches: 1,
      totalPages: 1,
      isLoading: false,
      error: null,
    })

    const { getByText, getByTestId } = render(<ManagedQuizzesList />)

    expect(getByText('JS Basics')).toBeInTheDocument()
    expect(getByTestId('update-quiz-5-link')).toHaveAttribute('href', '/manage-quizzes/5/update')
    expect(getByTestId('quiz-5-analytics-link')).toHaveAttribute('href', '/manage-quizzes/5/analytics')
  })
})
