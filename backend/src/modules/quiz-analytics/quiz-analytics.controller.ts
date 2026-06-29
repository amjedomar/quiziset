import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { QuizAnalyticsService } from '@/modules/quiz-analytics/quiz-analytics.service'
import { GetQuizAnalyticsQueryDto } from '@/modules/quiz-analytics/dto/get-quiz-analytics-query.dto'
import { PaginatedQuizAnalyticsEntity } from '@/modules/quiz-analytics/entities/paginated-quiz-analytics.entity'
import { AuthUser } from '@/decorators/auth-user.decorator'
import type { AuthUserData } from '@/decorators/auth-user.decorator'
import { ApiResponsesList } from '@/decorators/api-responses-list'

@Controller('quizzes/:quizId/analytics')
export class QuizAnalyticsController {
  constructor(private readonly quizAnalyticsService: QuizAnalyticsService) {}

  @Get()
  @ApiOperation({
    summary: 'list of the sessions that shared analytics for a quiz (this is accessible for quiz manager only)',
  })
  @ApiResponsesList({ status: 200, type: PaginatedQuizAnalyticsEntity }, 400, 401, 403, 404)
  getQuizAnalytics(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Query() query: GetQuizAnalyticsQueryDto,
    @AuthUser() user: AuthUserData,
  ): Promise<PaginatedQuizAnalyticsEntity> {
    return this.quizAnalyticsService.getAnalytics(quizId, user.userId, query)
  }
}
