import { render } from '@testing-library/react'
import QuizAnalyticsPage from './page'

const QuizAnalytics = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="quiz-analytics" />)
jest.mock('@/components/quiz/quiz-analytics', () => ({
  QuizAnalytics: (props: unknown) => QuizAnalytics(props),
}))

describe('QuizAnalyticsPage', () => {
  it('renders analytics for the quiz (matching the route quizId param)', async () => {
    const { getByTestId } = render(await QuizAnalyticsPage({ params: Promise.resolve({ quizId: '5' }) }))

    expect(getByTestId('quiz-analytics')).toBeInTheDocument()
    expect(QuizAnalytics).toHaveBeenCalledWith({ quizId: 5 })
  })
})
