import { ApiProperty } from '@nestjs/swagger'
import { PublicUserEntity } from '@/modules/user/entities/public-user.entity'

/**
 * one row of a quiz analytics = a single session that shared its analytics
 *
 * "finishTime" is null while the session is still ongoing (otherwise it is finished)
 */
export class QuizAnalyticsSessionEntity {
  @ApiProperty() id: number

  @ApiProperty({ type: PublicUserEntity, description: 'the user who took the quiz' })
  user: PublicUserEntity

  @ApiProperty({ description: 'total number of questions in the session' })
  questionsCount: number

  @ApiProperty({ description: 'number of correctly answered questions' })
  successfulAnswersCount: number

  @ApiProperty()
  startTime: Date

  @ApiProperty({ type: Date, nullable: true, description: 'null while the session is still ongoing' })
  finishTime: Date | null
}
