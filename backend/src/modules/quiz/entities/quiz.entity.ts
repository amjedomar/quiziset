import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { QuestionType } from '@/modules/quiz/dto/create-quiz.dto'
import { PublicUserEntity } from '@/modules/user/entities/public-user.entity'

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

  @ApiProperty({
    type: Number,
    nullable: true,
    description: 'quiz duration in minutes (null when there is no time limit)',
  })
  timeDurationInMinutes: number | null

  @ApiProperty() imageUrl: string

  @ApiProperty() isPublic: boolean

  @ApiProperty() isAnalyticsEnabled: boolean

  @ApiProperty({
    type: Number,
    description: 'average of all quiz review ratings (0 when there are no reviews yet)',
  })
  averageRating: number

  @ApiProperty({
    type: Number,
    description:
      'indicates how many times the quiz was finished by all quiz takers. ' +
      '(info: if same user finish same quiz multiple times then every finish is counted)',
  })
  totalFinishes: number

  @ApiPropertyOptional({
    type: [QuestionEntity],
    description:
      'returned only when querying a single quiz (with ?fields=DETAILS) AND if the current user is the quiz manager',
  })
  questions?: QuestionEntity[]

  @ApiPropertyOptional({
    type: Boolean,
    description: 'returned only when querying a single quiz (with ?fields=OVERVIEW)',
  })
  wasTakenByCurrentUserAtLeastOnce?: boolean

  @ApiPropertyOptional({
    type: Boolean,
    description: 'returned only when querying a single quiz (with ?fields=OVERVIEW)',
  })
  doesCurrentUserHaveActiveSession?: boolean

  @ApiPropertyOptional({
    type: Boolean,
    description:
      'whether the current (authenticated) user has marked this quiz as favorite (btw it is always false for anonymous users) ' +
      'please keep in mind that this attr is returned for GET requests only (but not for create/update quiz requests)',
  })
  isFavorite?: boolean

  @ApiProperty() managerId: number

  @ApiPropertyOptional({
    type: PublicUserEntity,
    description: 'the quiz creator (returned for GET requests only but not for create/update quiz requests)',
  })
  manager?: PublicUserEntity

  @ApiProperty() createdAt: Date

  @ApiProperty() updatedAt: Date
}
