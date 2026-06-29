import { IsIn, IsInt, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

// allowed "results per page" values the user can pick from
export const ANALYTICS_PAGE_SIZES = [10, 20, 30, 50]
export const DEFAULT_ANALYTICS_PAGE_SIZE = 20

export class GetQuizAnalyticsQueryDto {
  @IsOptional()
  @Type(() => Number) // query params arrive as string --> so convert it to number
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'page number (1-based)', minimum: 1, default: 1 })
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsIn(ANALYTICS_PAGE_SIZES)
  @ApiPropertyOptional({
    description: 'results per page (allowed values 10 20 30 50)',
    default: DEFAULT_ANALYTICS_PAGE_SIZE,
  })
  pageSize?: number
}
