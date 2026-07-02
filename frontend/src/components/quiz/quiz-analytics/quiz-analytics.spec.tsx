import { render } from '@testing-library/react'
import { makeQuizAnalyticsSession } from '@/test-utils/mocks'
import { QuizAnalytics } from './quiz-analytics'

const useGetQuizAnalytics = jest.fn()
jest.mock('@/generated-api-client/quiz-analytics', () => ({
  useGetQuizAnalytics: (...args: unknown[]) => useGetQuizAnalytics(...args),
}))

describe('QuizAnalytics', () => {
  it('correctly renders', () => {
    useGetQuizAnalytics.mockReturnValue({
      data: { data: { data: [makeQuizAnalyticsSession()], totalMatches: 1, totalPages: 1 } },
      isLoading: false,
    })

    const { asFragment } = render(<QuizAnalytics quizId={1} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('shows the number of sessions', () => {
    useGetQuizAnalytics.mockReturnValue({
      data: { data: { data: [makeQuizAnalyticsSession()], totalMatches: 1, totalPages: 1 } },
      isLoading: false,
    })

    const { getByText } = render(<QuizAnalytics quizId={1} />)

    expect(getByText('1 session')).toBeInTheDocument()
  })

  it('shows a message with a link to enable analytics when analytics is disabled', () => {
    useGetQuizAnalytics.mockReturnValue({
      data: { data: { statusCode: 400, message: 'Analytics is disabled for this quiz' } },
      isLoading: false,
    })

    const { getByText, getByTestId } = render(<QuizAnalytics quizId={1} />)

    expect(getByText('Analytics is disabled for this quiz')).toBeInTheDocument()
    expect(getByTestId('update-quiz-link')).toHaveAttribute('href', '/manage-quizzes/1/update')
  })
})
