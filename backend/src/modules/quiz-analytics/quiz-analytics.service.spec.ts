import { QuizAnalyticsService } from '@/modules/quiz-analytics/quiz-analytics.service'
import {
  makeQuizRecord,
  makeSessionRecord,
  makePublicUser,
  START_TIME,
  FINISH_TIME,
  QUIZ_ID,
  REQ_USER,
  QUIZ_SESSION_ID,
} from '@/test-utils/fixtures'

describe('QuizAnalyticsService', () => {
  let prisma: any
  let sessionService: any
  let service: QuizAnalyticsService

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn(),
      quiz: {
        findUnique: jest.fn(),
      },
      quizSession: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    }
    sessionService = {
      finalizeAllExpiredSessions: jest.fn().mockResolvedValue(undefined),
    }
    service = new QuizAnalyticsService(prisma, sessionService)
  })

  it('returns a paginated list of the sessions that shared analytics for a quiz owned by the manager', async () => {
    // the manager owns the quiz and analytics is enabled on it
    prisma.quiz.findUnique.mockResolvedValue(makeQuizRecord({ managerId: REQ_USER.userId, isAnalyticsEnabled: true }))

    const session = makeSessionRecord({
      user: makePublicUser(),
      finishTime: FINISH_TIME,
      successfulAnswersCount: 2,
    })

    const returnedSessions = [session]

    prisma.$transaction.mockResolvedValue([returnedSessions, returnedSessions.length])

    const result = await service.getAnalytics(QUIZ_ID, REQ_USER.userId, {})

    expect(result).toEqual({
      data: [
        {
          id: QUIZ_SESSION_ID,
          user: makePublicUser(),
          questionsCount: 2,
          successfulAnswersCount: 2,
          startTime: START_TIME,
          finishTime: FINISH_TIME,
        },
      ],
      page: 1,
      pageSize: 20,
      totalMatches: 1,
      totalPages: 1,
    })
  })
})
