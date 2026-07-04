import { ReviewController } from '@/modules/review/review.controller'
import { makeReviewEntity, QUIZ_ID, REQ_USER, REVIEW_ID } from '@/test-utils/mocks'

// the service is mocked so we only test that the controller delegates correctly
describe('ReviewController', () => {
  let reviewService: any
  let controller: ReviewController

  beforeEach(() => {
    reviewService = {
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }
    controller = new ReviewController(reviewService)
  })

  it('delegates listing the quiz reviews to the service and returns its result', async () => {
    const reviews = [makeReviewEntity()]

    reviewService.getAll.mockResolvedValue(reviews)

    const result = await controller.getQuizReviews(QUIZ_ID, REQ_USER)

    expect(reviewService.getAll).toHaveBeenCalledWith(QUIZ_ID, REQ_USER.userId)
    expect(result).toBe(reviews)
  })

  it('delegates creating a review to the service and returns its result', async () => {
    const dto = { rating: 5, comment: 'great quiz' }
    const review = makeReviewEntity({ isMine: true })

    reviewService.create.mockResolvedValue(review)

    const result = await controller.createReview(QUIZ_ID, dto, REQ_USER)

    expect(reviewService.create).toHaveBeenCalledWith(QUIZ_ID, REQ_USER.userId, dto)
    expect(result).toBe(review)
  })

  it('delegates updating a review to the service and returns its result', async () => {
    const dto = { rating: 4 }
    const review = makeReviewEntity({ rating: 4, isMine: true })

    reviewService.update.mockResolvedValue(review)

    const result = await controller.updateReview(QUIZ_ID, REVIEW_ID, dto, REQ_USER)

    expect(reviewService.update).toHaveBeenCalledWith(QUIZ_ID, REVIEW_ID, REQ_USER.userId, dto)
    expect(result).toBe(review)
  })

  it('delegates deleting a review to the service', async () => {
    reviewService.delete.mockResolvedValue(undefined)

    await controller.deleteReview(QUIZ_ID, REVIEW_ID, REQ_USER)

    expect(reviewService.delete).toHaveBeenCalledWith(QUIZ_ID, REVIEW_ID, REQ_USER.userId)
  })
})
