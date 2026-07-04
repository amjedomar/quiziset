import { QuizSessionController } from '@/modules/quiz-session/quiz-session.controller'
import { QUIZ_ID, QUIZ_SESSION_ID, REQ_USER } from '@/test-utils/mocks'

// the service is mocked so we only test that the controller delegates correctly
describe('QuizSessionController', () => {
  let quizSessionService: any
  let controller: QuizSessionController

  beforeEach(() => {
    quizSessionService = { startSession: jest.fn(), submitAnswer: jest.fn() }
    controller = new QuizSessionController(quizSessionService)
  })

  it('delegates starting a session to the service and returns its result', async () => {
    const dto = { isAnalyticsShared: true }
    const state = { sessionId: QUIZ_SESSION_ID, isFinished: false }

    quizSessionService.startSession.mockResolvedValue(state)

    const result = await controller.startQuizSession(QUIZ_ID, dto, REQ_USER)

    expect(quizSessionService.startSession).toHaveBeenCalledWith(QUIZ_ID, REQ_USER.userId, dto)
    expect(result).toBe(state)
  })

  it('delegates submitting an answer to the service and returns its result', async () => {
    const dto = { questionIndex: 0, answerIndexes: [0] }
    const state = { sessionId: QUIZ_SESSION_ID, isFinished: false }

    quizSessionService.submitAnswer.mockResolvedValue(state)

    const result = await controller.submitQuizSessionAnswer(QUIZ_ID, dto, REQ_USER)

    expect(quizSessionService.submitAnswer).toHaveBeenCalledWith(QUIZ_ID, REQ_USER.userId, dto)
    expect(result).toBe(state)
  })
})
