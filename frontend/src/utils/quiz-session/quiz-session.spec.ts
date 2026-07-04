import { makeQuizAnalyticsSession } from '@/test-utils/mocks'
import { formatQuizSessionScore } from './quiz-session'

describe('formatQuizSessionScore', () => {
  it('formats the score as "successful / total (percentage%)"', () => {
    const session = makeQuizAnalyticsSession({ questionsCount: 5, successfulAnswersCount: 3 })

    expect(formatQuizSessionScore(session)).toBe('3 / 5 (60%)')
  })

  it('returns 0% when there are no questions', () => {
    const session = makeQuizAnalyticsSession({ questionsCount: 0, successfulAnswersCount: 0 })

    expect(formatQuizSessionScore(session)).toBe('0 / 0 (0%)')
  })
})
