import { ApiProperty } from '@nestjs/swagger'
import { QuizAnalyticsSessionEntity } from '@/modules/quiz-analytics/entities/quiz-analytics-session.entity'

export class PaginatedQuizAnalyticsEntity {
  @ApiProperty({ type: [QuizAnalyticsSessionEntity] }) data: QuizAnalyticsSessionEntity[]

  @ApiProperty({ description: 'current page (1-based)' }) page: number

  @ApiProperty({ description: 'number of items per page' }) pageSize: number

  @ApiProperty({ description: 'total number of sessions matching the query (across all pages)' })
  totalMatches: number

  @ApiProperty({ description: 'total number of pages' }) totalPages: number
}
