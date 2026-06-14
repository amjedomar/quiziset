import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { QuestionType } from '@/modules/quiz/dto/create-quiz.dto'

class AnswerEntity {
  @ApiProperty() text: string

  @ApiPropertyOptional({ description: 'provided for all question types except "question-reorder"' })
  isCorrect?: boolean

  @ApiPropertyOptional({ description: 'provided for "question-cards" only' })
  imageUrl?: string
}

class QuestionEntity {
  @ApiProperty() title: string

  @ApiProperty({ enum: QuestionType }) questionType: QuestionType

  @ApiProperty({ type: [AnswerEntity] }) answers: AnswerEntity[]
}

export class QuizEntity {
  @ApiProperty() id: number
  @ApiProperty() title: string
  @ApiProperty() description: string
  @ApiProperty() imageUrl: string
  @ApiProperty() isPublic: boolean
  @ApiProperty() isAnalyticsEnabled: boolean
  @ApiProperty({ type: [QuestionEntity] }) questions: QuestionEntity[]
  @ApiProperty() managerId: number
  @ApiProperty() createdAt: Date
  @ApiProperty() updatedAt: Date
}
