import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ReviewService } from '@/modules/review/review.service'
import { CreateReviewDto } from '@/modules/review/dto/create-review.dto'
import { UpdateReviewDto } from '@/modules/review/dto/update-review.dto'
import { ReviewEntity } from '@/modules/review/entities/review.entity'
import { AuthUser } from '@/decorators/auth-user'
import type { AuthUserData } from '@/decorators/auth-user'
import { IsPublic } from '@/decorators/is-public'
import { ApiResponsesList } from '@/decorators/api-responses-list'

@Controller('quizzes/:quizId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'list all reviews of a quiz' })
  @ApiResponsesList({ status: 200, type: [ReviewEntity] }, 403, 404)
  getQuizReviews(
    @Param('quizId', ParseIntPipe) quizId: number,
    @AuthUser() user?: AuthUserData,
  ): Promise<ReviewEntity[]> {
    return this.reviewService.getAll(quizId, user?.userId)
  }

  @Post()
  @ApiOperation({ summary: 'leave a review (only allowed once and only after finishing the quiz at least once)' })
  @ApiResponsesList({ status: 201, type: ReviewEntity }, 401, 403, 404, 422)
  createReview(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Body() dto: CreateReviewDto,
    @AuthUser() user: AuthUserData,
  ): Promise<ReviewEntity> {
    return this.reviewService.create(quizId, user.userId, dto)
  }

  @Patch(':reviewId')
  @ApiOperation({ summary: 'update your own review' })
  @ApiResponsesList({ status: 200, type: ReviewEntity }, 401, 403, 404, 422)
  updateReview(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() dto: UpdateReviewDto,
    @AuthUser() user: AuthUserData,
  ): Promise<ReviewEntity> {
    return this.reviewService.update(quizId, reviewId, user.userId, dto)
  }

  @Delete(':reviewId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'delete your own review' })
  @ApiResponsesList({ status: 204, description: 'review deleted' }, 401, 403, 404)
  deleteReview(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @AuthUser() user: AuthUserData,
  ): Promise<void> {
    return this.reviewService.delete(quizId, reviewId, user.userId)
  }
}
