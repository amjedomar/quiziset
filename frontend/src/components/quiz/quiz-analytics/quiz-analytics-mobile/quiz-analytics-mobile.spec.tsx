import { render } from '@testing-library/react'
import { makeQuizAnalyticsSession } from '@/test-utils/mocks'
import { QuizAnalyticsMobile } from './quiz-analytics-mobile'

const sessions = [makeQuizAnalyticsSession()]

describe('QuizAnalyticsMobile', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<QuizAnalyticsMobile sessions={sessions} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it("renders the session's user and score", () => {
    const { getByText } = render(<QuizAnalyticsMobile sessions={sessions} />)

    expect(getByText('Amjed Omar')).toBeInTheDocument()
    expect(getByText('3 / 5 (60%)')).toBeInTheDocument()
  })
})
