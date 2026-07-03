import { render } from '@testing-library/react'
import { makeQuiz } from '@/test-utils/mocks'
import QuizUpdatePage from './page'

jest.mock('next/navigation', () => ({
  useParams: () => ({ quizId: '5' }),
}))

const QuizForm = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="quiz-form" />)
jest.mock('@/components/quiz/quiz-form', () => ({
  QuizForm: (props: unknown) => QuizForm(props),
}))

const useGetSingleQuiz = jest.fn()
jest.mock('@/generated-api-client/quiz', () => ({
  useGetSingleQuiz: (...args: unknown[]) => useGetSingleQuiz(...args),
}))

describe('QuizUpdatePage', () => {
  it('fetches and renders the quiz form', () => {
    const quiz = makeQuiz()

    useGetSingleQuiz.mockReturnValue({ data: { data: quiz }, isLoading: false })

    const { getByTestId } = render(<QuizUpdatePage />)

    expect(useGetSingleQuiz).toHaveBeenCalledWith(5, { fields: 'DETAILS' })
    expect(getByTestId('quiz-form')).toBeInTheDocument()
    expect(QuizForm).toHaveBeenCalledWith({ existingQuiz: quiz })
  })

  it('shows a loading indicator while fetching', () => {
    useGetSingleQuiz.mockReturnValue({ data: undefined, isLoading: true })

    const { getByTestId } = render(<QuizUpdatePage />)

    expect(getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('shows an error message when the request fails', () => {
    useGetSingleQuiz.mockReturnValue({
      data: { data: { statusCode: 404, message: 'Quiz not found' } },
      isLoading: false,
    })

    const { getByText } = render(<QuizUpdatePage />)

    expect(getByText('Error Quiz not found')).toBeInTheDocument()
  })
})
