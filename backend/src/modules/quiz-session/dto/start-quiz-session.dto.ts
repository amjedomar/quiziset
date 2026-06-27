import { IsBoolean, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class StartQuizSessionDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'must be true to start a session when the quiz has analytics enabled ' +
      '(otherwise a 400 bad request error is returned)',
  })
  isAnalyticsShared?: boolean
}
