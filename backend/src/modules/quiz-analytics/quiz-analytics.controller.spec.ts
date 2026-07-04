import { QuizAnalyticsController } from '@/modules/quiz-analytics/quiz-analytics.controller'
import { QUIZ_ID, REQ_USER } from '@/test-utils/mocks'

// the service is mocked so we only test that the controller delegates correctly
describe('QuizAnalyticsController', () => {
  let quizAnalyticsService: any
  let controller: QuizAnalyticsController

  beforeEach(() => {
    quizAnalyticsService = { getAnalytics: jest.fn() }
    controller = new QuizAnalyticsController(quizAnalyticsService)
  })

  it('delegates getting the quiz analytics to the service and returns its result', async () => {
    const query = { page: 1, pageSize: 20 }
    const analytics = { data: [], page: 1, pageSize: 20, totalMatches: 0, totalPages: 0 }

    quizAnalyticsService.getAnalytics.mockResolvedValue(analytics)

    const result = await controller.getQuizAnalytics(QUIZ_ID, query, REQ_USER)

    expect(quizAnalyticsService.getAnalytics).toHaveBeenCalledWith(QUIZ_ID, REQ_USER.userId, query)
    expect(result).toBe(analytics)
  })
})
