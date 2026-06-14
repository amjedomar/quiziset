import { IsBoolean, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class GetAllQuizzesQueryDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'when true returns only quizzes managed by the current user' })
  managedByMe?: boolean
}
