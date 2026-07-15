import { render } from '@testing-library/react'
import { makeQuiz } from '@/test-utils/mocks'
import { FavoriteQuizzesList } from './favorite-quizzes-list'

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

jest.mock('@/components/snackbar', () => ({
  useSnackbar: () => ({ showError: jest.fn(), showSuccess: jest.fn() }),
}))

describe('FavoriteQuizzesList', () => {
  it('correctly renders', () => {
    useQuizzesQuery.mockReturnValue({
      quizzes: [makeQuiz()],
      totalMatches: 1,
      totalPages: 1,
      isLoading: false,
      error: null,
    })

    const { asFragment } = render(<FavoriteQuizzesList />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('shows a message pointing to the explore page when there are no favorites', () => {
    useQuizzesQuery.mockReturnValue({ quizzes: [], totalMatches: 0, totalPages: 0, isLoading: false, error: null })

    const { getByText, getByTestId } = render(<FavoriteQuizzesList />)

    expect(getByText('No favorites yet')).toBeInTheDocument()
    expect(getByTestId('explore-page-link')).toHaveAttribute('href', '/')
  })
})
