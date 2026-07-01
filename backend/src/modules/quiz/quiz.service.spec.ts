import { QuizService } from '@/modules/quiz/quiz.service'
import { makeQuizRecord, QUIZ_ID, REQ_USER } from '@/test-utils/fixtures'

describe('QuizService', () => {
  let prisma: any
  let sessionService: any
  let service: QuizService

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn(),
      quiz: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      favorite: {
        findMany: jest.fn(),
      },
    }
    sessionService = {
      finalizeAllExpiredSessions: jest.fn().mockResolvedValue(undefined),
    }
    service = new QuizService(prisma, sessionService)
  })

  it('returns a paginated list of quizzes with the favorite flag attached to each one', async () => {
    // questions are omitted when requesting a list of quizzes
    const { questions: _questionsOne, ...quizOne } = makeQuizRecord()
    const { questions: _questionsTwo, ...quizTwo } = makeQuizRecord({ id: 2, title: 'css basics' })

    const returnedQuizzes = [quizOne, quizTwo]

    prisma.$transaction.mockResolvedValue([returnedQuizzes, returnedQuizzes.length])

    prisma.favorite.findMany.mockResolvedValue([{ quizId: QUIZ_ID }])

    const result = await service.getAll({}, REQ_USER.userId)

    expect(result).toEqual({
      data: [
        { ...quizOne, isFavorite: true },
        { ...quizTwo, isFavorite: false },
      ],
      page: 1,
      pageSize: 12,
      totalMatches: 2,
      totalPages: 1,
    })
  })

  it('returns a single quiz without exposing its questions to non managers', async () => {
    const ANONYMOUS_USER = undefined

    const quizRecord = makeQuizRecord({ isPublic: true })

    prisma.quiz.findUnique.mockResolvedValue(quizRecord)

    const result = await service.get(QUIZ_ID, {}, ANONYMOUS_USER)

    // since this request is simulated to be done by ANONYMOUS_USER
    // "questions" should be omitted and isFavorite should be false
    const { questions: _questions, ...expected } = quizRecord

    expect(result).toEqual({ ...expected, isFavorite: false })
  })

  it('creates a quiz for the current user and returns it', async () => {
    const dto = {
      title: 'js basics',
      description: 'a quiz about javascript',
      timeDurationInMinutes: 30,
      imageUrl: '/uploads/quizzes/cover.png',
      isPublic: true,
      isAnalyticsEnabled: false,
      questions: [],
    }
    const createdQuiz = makeQuizRecord({ ...dto })

    prisma.quiz.create.mockResolvedValue(createdQuiz)

    const result = await service.create(dto, REQ_USER.userId)

    expect(prisma.quiz.create).toHaveBeenCalledWith({ data: { ...dto, managerId: REQ_USER.userId } })
    expect(result).toBe(createdQuiz)
  })

  it('updates a quiz owned by the current user', async () => {
    const updatedQuiz = makeQuizRecord({ title: 'new title' })

    prisma.quiz.findUnique.mockResolvedValue(makeQuizRecord({ imageUrl: '/public/cover.png' }))
    prisma.quiz.update.mockResolvedValue(updatedQuiz)

    const result = await service.update(QUIZ_ID, { title: 'new title' }, REQ_USER.userId)

    expect(prisma.quiz.update).toHaveBeenCalledWith({ where: { id: QUIZ_ID }, data: { title: 'new title' } })
    expect(result).toBe(updatedQuiz)
  })

  it('deletes a quiz owned by the current user', async () => {
    prisma.quiz.findUnique.mockResolvedValue(makeQuizRecord({ imageUrl: '/public/cover.png' }))
    prisma.quiz.delete.mockResolvedValue(undefined)

    await service.delete(QUIZ_ID, REQ_USER.userId)

    expect(prisma.quiz.delete).toHaveBeenCalledWith({ where: { id: QUIZ_ID } })
  })
})
