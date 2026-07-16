import { render } from '@testing-library/react'
import { makeQuiz } from '@/test-utils/mocks'
import { QuizOverview } from './quiz-overview'

jest.mock('@/constants/api-url', () => ({
  NEXT_PUBLIC_API_BASE_URL: 'http://mock-backend',
}))

jest.mock('@/components/quiz/favorite-button', () => ({
  FavoriteButton: () => null,
}))

jest.mock('@/components/reviews/reviews-section', () => ({
  ReviewsSection: () => null,
}))

jest.mock('@/components/snackbar', () => ({
  useSnackbar: () => ({ showError: jest.fn(), showSuccess: jest.fn() }),
}))

const useGetSingleQuiz = jest.fn()
jest.mock('@/generated-api-client/quiz', () => ({
  useGetSingleQuiz: (...args: unknown[]) => useGetSingleQuiz(...args),
}))

describe('QuizOverview', () => {
  it('correctly renders', () => {
    useGetSingleQuiz.mockReturnValue({ data: { data: makeQuiz() }, isLoading: false })

    const { asFragment } = render(<QuizOverview quizId={1} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it("renders the quiz's details and a link to start the quiz", () => {
    useGetSingleQuiz.mockReturnValue({
      data: { data: makeQuiz({ totalFinishes: 3 }) },
      isLoading: false,
    })

    const { getByText, getByTestId } = render(<QuizOverview quizId={1} />)

    expect(getByTestId('quiz-title')).toHaveTextContent('JS Basics')
    expect(getByText('3 finishes')).toBeInTheDocument()
    expect(getByText('Created by Amjed Omar')).toBeInTheDocument()
    expect(getByTestId('start-quiz-link')).toHaveAttribute('href', '/quizzes/1/session')
  })
})
