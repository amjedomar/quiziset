import { render } from '@testing-library/react'
import { makeQuizAnalyticsSession } from '@/test-utils/mocks'
import { QuizAnalyticsDesktop } from './quiz-analytics-desktop'

const sessions = [makeQuizAnalyticsSession()]

describe('QuizAnalyticsDesktop', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<QuizAnalyticsDesktop sessions={sessions} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it("renders the session's user and score", () => {
    const { getByText } = render(<QuizAnalyticsDesktop sessions={sessions} />)

    expect(getByText('Amjed Omar')).toBeInTheDocument()
    expect(getByText('3 / 5 (60%)')).toBeInTheDocument()
  })
})
