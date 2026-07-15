import { render } from '@testing-library/react'
import { makeQuiz } from '@/test-utils/mocks'
import { Homepage } from './homepage'

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

describe('Homepage', () => {
  beforeEach(() => {
    useQuizzesQuery.mockReturnValue({
      quizzes: [makeQuiz()],
      totalMatches: 1,
      totalPages: 1,
      isLoading: false,
      error: null,
    })
  })

  it('correctly renders', () => {
    const { asFragment } = render(<Homepage initialParams={{ page: 1 }} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('shows the total matches and a link to create a quiz', () => {
    const { getByTestId } = render(<Homepage initialParams={{ page: 1 }} />)

    expect(getByTestId('total-matches')).toHaveTextContent('1 total match')
    expect(getByTestId('create-quiz-link')).toHaveTextContent('create your own quiz')
    expect(getByTestId('create-quiz-link')).toHaveAttribute('href', '/manage-quizzes/create')
  })

  it('renders the quizzes grid', () => {
    const { getByText } = render(<Homepage initialParams={{ page: 1 }} />)

    expect(getByText('JS Basics')).toBeInTheDocument()
  })
})
