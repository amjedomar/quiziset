import { QuizFavoriteService } from '@/modules/quiz-favorite/quiz-favorite.service'
import { makeQuizRecord, QUIZ_ID, USER_ID } from '@/test-utils/mocks'

describe('QuizFavoriteService', () => {
  let prisma: any
  let service: QuizFavoriteService

  beforeEach(() => {
    prisma = {
      quiz: {
        findUnique: jest.fn(),
      },
      favorite: {
        upsert: jest.fn(),
        deleteMany: jest.fn(),
      },
    }
    service = new QuizFavoriteService(prisma)
  })

  it('adds the quiz to the current user favorites', async () => {
    prisma.quiz.findUnique.mockResolvedValue(makeQuizRecord({ isPublic: true }))
    prisma.favorite.upsert.mockResolvedValue(undefined)

    await service.add(QUIZ_ID, USER_ID)

    expect(prisma.favorite.upsert).toHaveBeenCalledWith({
      where: { quizId_userId: { quizId: QUIZ_ID, userId: USER_ID } },
      create: { quizId: QUIZ_ID, userId: USER_ID },
      update: {},
    })
  })

  it('removes the quiz from the current user favorites', async () => {
    prisma.favorite.deleteMany.mockResolvedValue({ count: 1 })

    await service.remove(QUIZ_ID, USER_ID)

    expect(prisma.favorite.deleteMany).toHaveBeenCalledWith({ where: { quizId: QUIZ_ID, userId: USER_ID } })
  })
})
