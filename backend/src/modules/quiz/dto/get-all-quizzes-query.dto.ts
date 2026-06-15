import { IsBoolean, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class GetAllQuizzesQueryDto {
  @IsOptional()
  @IsBoolean()
  // query param value arrive as string -> so convert 'true' string into boolean type
  @Transform(({ value }: { value: unknown }) => value === 'true')
  @ApiPropertyOptional({ description: 'when true returns only quizzes managed by the current user' })
  managedByMe?: boolean
}
