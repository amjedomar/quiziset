import { QuizAnalyticsSessionEntity } from '@/generated-api-client/model'

/**
 * e.g. of the returned value "3 / 5 (60%)"
 */
export function formatQuizSessionScore(session: QuizAnalyticsSessionEntity): string {
  const percentage =
    session.questionsCount > 0 ? Math.round((session.successfulAnswersCount / session.questionsCount) * 100) : 0

  return `${session.successfulAnswersCount} / ${session.questionsCount} (${percentage}%)`
}
