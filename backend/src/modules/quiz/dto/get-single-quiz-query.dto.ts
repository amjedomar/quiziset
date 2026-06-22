import { IsEnum, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export enum QuizFields {
  DETAILS = 'DETAILS',
  OVERVIEW = 'OVERVIEW',
}

export class GetSingleQuizQueryDto {
  @IsEnum(QuizFields)
  @IsOptional()
  @ApiPropertyOptional({
    enum: QuizFields,
    description:
      'DETAILS: include questions (for quiz manager only). ' +
      'OVERVIEW: include wasTakenByCurrentUserAtLeastOnce & doesCurrentUserHaveActiveSession',
  })
  fields?: QuizFields
}
