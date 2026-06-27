import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateReviewDto } from '@/modules/review/dto/create-review.dto'
import { UpdateReviewDto } from '@/modules/review/dto/update-review.dto'
import { ReviewEntity } from '@/modules/review/entities/review.entity'
import { omitUndefinedAttrs } from '@/utils/omit-undefined-attrs.util'
import { Prisma } from '@/generated/prisma/client'
import { PUBLIC_USER_INCLUDE } from '@/modules/user/entities/public-user.entity'

const ReviewErrors = {
  QUIZ_NOT_FOUND: 'quiz not found',
  QUIZ_PRIVATE: 'this quiz is private',
  NOT_FINISHED: 'you must finish the quiz at least once before leaving a review',
  ALREADY_REVIEWED: 'you have already reviewed this quiz',
  REVIEW_NOT_FOUND: 'review not found',
  NOT_REVIEW_OWNER: 'you can only modify your own review',
}

// a review joined with the user table (the public author data)
const reviewInclude = {
  user: { select: PUBLIC_USER_INCLUDE },
} satisfies Prisma.ReviewInclude

type ReviewWithAuthor = Prisma.ReviewGetPayload<{ include: typeof reviewInclude }>

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getAll(quizId: number, userId?: number): Promise<ReviewEntity[]> {
    await this.ensureQuizAccessible(quizId, userId)

    const reviews = await this.prisma.review.findMany({
      where: { quizId },
      include: reviewInclude,
      orderBy: [{ updatedAt: 'desc' }], // newest first
    })

    return reviews.map((review) => this.toEntity(review, userId))
  }

  async create(quizId: number, userId: number, dto: CreateReviewDto): Promise<ReviewEntity> {
    await this.ensureQuizAccessible(quizId, userId)
    await this.ensureUserFinishedQuiz(quizId, userId)

    const existingReview = await this.prisma.review.findUnique({
      where: { quizId_userId: { quizId, userId } },
      select: { id: true },
    })

    if (existingReview) {
      throw new ForbiddenException(ReviewErrors.ALREADY_REVIEWED)
    }

    const review = await this.prisma.$transaction(async (tx) => {
      const created = await tx.review.create({
        data: {
          quizId,
          userId,
          rating: dto.rating,
          comment: this.normalizeComment(dto.comment),
        },
        include: reviewInclude,
      })

      await this.recalculateAverageRating(tx, quizId)

      return created
    })

    return this.toEntity(review, userId)
  }

  async update(quizId: number, reviewId: number, userId: number, dto: UpdateReviewDto): Promise<ReviewEntity> {
    await this.findOwnReviewOrThrow(quizId, reviewId, userId)

    // omit fields that weren't provided so they keep their current value
    const data = omitUndefinedAttrs({
      rating: dto.rating,
      comment: this.normalizeComment(dto.comment),
    })

    const review = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id: reviewId },
        data,
        include: reviewInclude,
      })

      await this.recalculateAverageRating(tx, quizId)

      return updated
    })

    return this.toEntity(review, userId)
  }

  async delete(quizId: number, reviewId: number, userId: number): Promise<void> {
    await this.findOwnReviewOrThrow(quizId, reviewId, userId)

    await this.prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id: reviewId } })
      await this.recalculateAverageRating(tx, quizId)
    })
  }

  /**
   * ensures the quiz exists and the current user is allowed to see it
   */
  private async ensureQuizAccessible(quizId: number, userId?: number): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: { isPublic: true, managerId: true },
    })

    if (!quiz) {
      throw new NotFoundException(ReviewErrors.QUIZ_NOT_FOUND)
    }

    if (!quiz.isPublic && quiz.managerId !== userId) {
      throw new ForbiddenException(ReviewErrors.QUIZ_PRIVATE)
    }
  }

  /**
   * a user can only review a quiz they finished at least once
   */
  private async ensureUserFinishedQuiz(quizId: number, userId: number): Promise<void> {
    const finishedSession = await this.prisma.quizSession.findFirst({
      where: { quizId, userId, finishTime: { not: null } },
      select: { id: true },
    })

    if (!finishedSession) {
      throw new ForbiddenException(ReviewErrors.NOT_FINISHED)
    }
  }

  /**
   * finds the review and ensures it belongs to BOTH the given quiz and the current user
   */
  private async findOwnReviewOrThrow(quizId: number, reviewId: number, userId: number) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } })

    if (!review || review.quizId !== quizId) {
      throw new NotFoundException(ReviewErrors.REVIEW_NOT_FOUND)
    }

    if (review.userId !== userId) {
      throw new ForbiddenException(ReviewErrors.NOT_REVIEW_OWNER)
    }

    return review
  }

  /**
   * recalculates "quiz.averageRating" from all of its reviews (rounded to 1 decimal e.g. 4.7)
   *
   * I called it inside a transaction (so we can rest assure that this update
   * together with the review create/update/delete are either performed both
   * successfully. otherwise transaction will be rolled out for both operations)
   */
  private async recalculateAverageRating(tx: Prisma.TransactionClient, quizId: number): Promise<void> {
    const aggregate = await tx.review.aggregate({
      where: { quizId },
      _avg: { rating: true },
    })

    const average = aggregate._avg.rating ?? 0
    const roundedAverage = Math.round(average * 10) / 10

    await tx.quiz.update({
      where: { id: quizId },
      data: { averageRating: roundedAverage },
    })
  }

  private normalizeComment(comment?: string): string | undefined {
    const trimmed = comment?.trim()
    return trimmed ? trimmed : undefined
  }

  /**
   * This maps it to the output that will be returned in response
   */
  private toEntity(review: ReviewWithAuthor, currentUserId?: number): ReviewEntity {
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      author: {
        id: review.user.id,
        name: review.user.name,
        imageUrl: review.user.imageUrl,
      },
      isMine: currentUserId !== undefined && review.userId === currentUserId,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }
  }
}
