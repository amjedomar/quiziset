import { ForbiddenException } from '@nestjs/common'
import { QuizService } from '@/modules/quiz/quiz.service'
import { makeQuizRecord, QUIZ_ID, REQ_USER } from '@/test-utils/mocks'

describe('QuizService', () => {
  let prisma: any
  let sessionService: any
  let service: QuizService

  beforeEach(() => {
    jest.resetAllMocks()

    prisma = {
      // prisma transaction can accept either function or array (so the mock follow the same behavior)
      $transaction: jest.fn((arg: unknown) => (typeof arg === 'function' ? arg(prisma) : Promise.resolve(arg))),
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
      quizUpload: {
        findMany: jest.fn().mockResolvedValue([]),
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
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
    // the cover upload belongs to the user (so linking succeeds)
    prisma.quizUpload.findMany.mockResolvedValue([{ fileName: 'cover.png' }])

    const result = await service.create(dto, REQ_USER.userId)

    expect(prisma.quiz.create).toHaveBeenCalledWith({ data: { ...dto, managerId: REQ_USER.userId } })
    // the referenced upload is linked to the new quiz
    expect(prisma.quizUpload.updateMany).toHaveBeenCalledWith({
      where: { bucket: 'quizzes', fileName: { in: ['cover.png'] } },
      data: { quizId: QUIZ_ID },
    })
    expect(result).toBe(createdQuiz)
  })

  it('rejects creating a quiz that references an image the user does not own', async () => {
    const dto = {
      title: 'js basics',
      description: 'a quiz about javascript',
      timeDurationInMinutes: 30,
      imageUrl: '/uploads/quizzes/not-mine.png',
      isPublic: true,
      isAnalyticsEnabled: false,
      questions: [],
    }

    prisma.quiz.create.mockResolvedValue(makeQuizRecord({ ...dto }))
    // no eligible upload row -> the image isn't the user's
    prisma.quizUpload.findMany.mockResolvedValue([])

    await expect(service.create(dto, REQ_USER.userId)).rejects.toThrow(ForbiddenException)
  })

  it('updates a quiz owned by the current user', async () => {
    const OLD_COVER = '/uploads/quizzes/old-cover.png'
    const NEW_COVER = '/uploads/quizzes/new-cover.png'

    const updatedQuiz = makeQuizRecord({ title: 'new title', imageUrl: NEW_COVER })

    prisma.quiz.findUnique.mockResolvedValue(makeQuizRecord({ imageUrl: OLD_COVER }))
    prisma.quiz.update.mockResolvedValue(updatedQuiz)
    // the updated quiz's cover upload belongs to the user (so linking succeeds)
    prisma.quizUpload.findMany.mockResolvedValue([{ fileName: 'new-cover.png' }])

    const result = await service.update(QUIZ_ID, { title: 'new title' }, REQ_USER.userId)

    expect(prisma.quiz.update).toHaveBeenCalledWith({ where: { id: QUIZ_ID }, data: { title: 'new title' } })
    // rows of images no longer referenced by the quiz (e.g. the old cover) are pruned
    expect(prisma.quizUpload.deleteMany).toHaveBeenCalledWith({
      where: { bucket: 'quizzes', quizId: QUIZ_ID, fileName: { notIn: ['new-cover.png'] } },
    })
    expect(result).toBe(updatedQuiz)
  })

  it('deletes a quiz owned by the current user', async () => {
    prisma.quiz.findUnique.mockResolvedValue(makeQuizRecord({ imageUrl: '/public/cover.png' }))
    prisma.quiz.delete.mockResolvedValue(undefined)

    await service.delete(QUIZ_ID, REQ_USER.userId)

    expect(prisma.quiz.delete).toHaveBeenCalledWith({ where: { id: QUIZ_ID } })
  })
})
