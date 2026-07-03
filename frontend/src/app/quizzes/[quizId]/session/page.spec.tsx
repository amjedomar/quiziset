import { render } from '@testing-library/react'
import QuizSessionPage from './page'

jest.mock('next/navigation', () => ({
  useParams: () => ({ quizId: '5' }),
}))

const QuizSession = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="quiz-session" />)
jest.mock('@/components/quiz/quiz-session', () => ({
  QuizSession: (props: unknown) => QuizSession(props),
}))

describe('QuizSessionPage', () => {
  it('renders the quiz session for the quiz (matching the route quizId param)', () => {
    const { getByTestId } = render(<QuizSessionPage />)

    expect(getByTestId('quiz-session')).toBeInTheDocument()
    expect(QuizSession).toHaveBeenCalledWith({ quizId: 5 })
  })
})
