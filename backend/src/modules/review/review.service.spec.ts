import { ReviewService } from '@/modules/review/review.service'
import { makeReviewRecord, makeReviewEntity, QUIZ_ID, USER_ID, REVIEW_ID, QUIZ_SESSION_ID } from '@/test-utils/mocks'

describe('ReviewService', () => {
  let prisma: any
  let tx: any
  let service: ReviewService

  beforeEach(() => {
    tx = {
      review: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        aggregate: jest.fn().mockResolvedValue({ _avg: { rating: 5 } }),
      },
      quiz: {
        update: jest.fn(),
      },
    }
    prisma = {
      $transaction: jest.fn((callback: any) => callback(tx)),
      quiz: {
        findUnique: jest.fn(),
      },
      review: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      quizSession: {
        findFirst: jest.fn(),
      },
    }
    service = new ReviewService(prisma)
  })

  it('returns all reviews of quiz and sets "isMine" for the current user own review', async () => {
    prisma.quiz.findUnique.mockResolvedValue({ isPublic: true, managerId: USER_ID })
    prisma.review.findMany.mockResolvedValue([makeReviewRecord()])

    const result = await service.getAll(QUIZ_ID, USER_ID)

    expect(result).toEqual([makeReviewEntity({ isMine: true })])
  })

  it('creates a review for a quiz the user has finished and returns it', async () => {
    prisma.quiz.findUnique.mockResolvedValue({ isPublic: true, managerId: USER_ID })

    prisma.quizSession.findFirst.mockResolvedValue({ id: QUIZ_SESSION_ID }) // the user finished the quiz at least once
    prisma.review.findUnique.mockResolvedValue(null) // the user has not reviewed this quiz before
    tx.review.create.mockResolvedValue(makeReviewRecord())

    const result = await service.create(QUIZ_ID, USER_ID, { rating: 5, comment: 'great quiz' })

    expect(tx.review.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { quizId: QUIZ_ID, userId: USER_ID, rating: 5, comment: 'great quiz' } }),
    )

    expect(result).toEqual(makeReviewEntity({ isMine: true }))
  })

  it('updates the current user own review and returns it', async () => {
    prisma.review.findUnique.mockResolvedValue({ id: REVIEW_ID, quizId: QUIZ_ID, userId: USER_ID })
    tx.review.update.mockResolvedValue(makeReviewRecord({ rating: 4 }))

    const result = await service.update(QUIZ_ID, REVIEW_ID, USER_ID, { rating: 4 })

    expect(tx.review.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: REVIEW_ID }, data: { rating: 4 } }),
    )

    expect(result).toEqual(makeReviewEntity({ isMine: true, rating: 4 }))
  })

  it('deletes the current user own review', async () => {
    prisma.review.findUnique.mockResolvedValue({ id: REVIEW_ID, quizId: QUIZ_ID, userId: USER_ID })
    tx.review.delete.mockResolvedValue(undefined)

    await service.delete(QUIZ_ID, REVIEW_ID, USER_ID)

    expect(tx.review.delete).toHaveBeenCalledWith({ where: { id: REVIEW_ID } })
  })
})
