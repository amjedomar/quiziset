import { ApiProperty } from '@nestjs/swagger'
import { QuizEntity } from '@/modules/quiz/entities/quiz.entity'

export class PaginatedQuizzesEntity {
  @ApiProperty({ type: [QuizEntity] }) data: QuizEntity[]

  @ApiProperty({ description: 'current page (1-based)' }) page: number

  @ApiProperty({ description: 'number of items per page' }) pageSize: number

  @ApiProperty({ description: 'total number of quizzes matching the query (across all pages)' })
  totalMatches: number

  @ApiProperty({ description: 'total number of pages' }) totalPages: number
}
