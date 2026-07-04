import { QuizSessionService } from '@/modules/quiz-session/quiz-session.service'
import { makeQuizRecord, makeSessionRecord, QUIZ_ID, USER_ID, QUIZ_SESSION_ID } from '@/test-utils/mocks'
import { getCorrectAnswerIndexes, toExposedQuestion } from '@/utils/quiz/quiz-session'

describe('QuizSessionService', () => {
  let prisma: any
  let service: QuizSessionService

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn(),
      quiz: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      quizSession: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    }
    service = new QuizSessionService(prisma)
  })

  it('starts a new session and returns the first question', async () => {
    const createdSession = makeSessionRecord({ currentQuestionIndex: 0 })

    prisma.quiz.findUnique.mockResolvedValue(makeQuizRecord({ timeDurationInMinutes: null, isAnalyticsEnabled: false }))
    prisma.quizSession.findFirst.mockResolvedValue(null) // there is no active session yet for this user
    prisma.quizSession.create.mockResolvedValue(createdSession)

    const result = await service.startSession(QUIZ_ID, USER_ID, {})

    expect(prisma.quizSession.create).toHaveBeenCalled()
    expect(result).toEqual({
      sessionId: QUIZ_SESSION_ID,
      questionsCount: 2,
      currentQuestionIndex: 0,
      expireTime: null,
      isFinished: false,
      currentQuestion: toExposedQuestion(createdSession.questions[0]),
    })
  })

  it('grades the current answer and returns the next question', async () => {
    const session = makeSessionRecord({ currentQuestionIndex: 0 })
    const updatedSession = makeSessionRecord({ currentQuestionIndex: 1, successfulAnswersCount: 1 })

    prisma.quizSession.findFirst.mockResolvedValue(session)
    prisma.quizSession.update.mockResolvedValue(updatedSession)

    // use "getCorrectAnswerIndexes" to get the current question's correct answer indexes
    // since questions/answers are shuffled
    const correctAnswerIndexes = getCorrectAnswerIndexes(session.questions[0])

    const result = await service.submitAnswer(QUIZ_ID, USER_ID, {
      questionIndex: 0,
      answerIndexes: correctAnswerIndexes,
    })

    expect(prisma.quizSession.update).toHaveBeenCalledWith({
      where: { id: session.id },
      data: { successfulAnswersCount: 1, currentQuestionIndex: 1 },
    })

    expect(result).toEqual({
      sessionId: QUIZ_SESSION_ID,
      questionsCount: 2,
      currentQuestionIndex: 1,
      expireTime: null,
      isFinished: false,
      currentQuestion: toExposedQuestion(updatedSession.questions[1]),
    })
  })

  it('finalizes the expired sessions and bumps the quiz finish count', async () => {
    const expireTime = new Date('2026-05-06T00:00:00.000Z')

    prisma.quizSession.findMany.mockResolvedValue([makeSessionRecord({ expireTime })])
    prisma.$transaction.mockResolvedValue([makeSessionRecord({ finishTime: expireTime }), {}])

    await service.finalizeAllExpiredSessions()

    expect(prisma.quizSession.findMany).toHaveBeenCalledWith({
      where: { finishTime: null, expireTime: { not: null, lte: expect.any(Date) } },
    })

    expect(prisma.quizSession.update).toHaveBeenCalledWith({
      where: { id: QUIZ_SESSION_ID },
      data: { finishTime: expireTime },
    })

    expect(prisma.quiz.update).toHaveBeenCalledWith({
      where: { id: QUIZ_ID },
      data: { totalFinishes: { increment: 1 } },
    })
  })
})
