import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export enum QuizSortBy {
  Date = 'date',
  Rating = 'rating',
  Popularity = 'popularity',
  Name = 'name',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export class GetAllQuizzesQueryDto {
  @IsOptional()
  @IsBoolean()
  // query param value arrive as string -> so convert 'true' string into boolean type
  @Transform(({ value }: { value: unknown }) => value === 'true')
  @ApiPropertyOptional({ description: 'when true returns only quizzes managed by the current user' })
  managedByMe?: boolean

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: { value: unknown }) => value === 'true')
  @ApiPropertyOptional({ description: 'when true returns only quizzes marked as favorite by the current user' })
  favoritedByMe?: boolean

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ description: 'filter quizzes by title (case-insensitive)' })
  search?: string

  @IsOptional()
  @IsEnum(QuizSortBy)
  @ApiPropertyOptional({
    enum: QuizSortBy,
    description: 'field to sort by (defaults by "date" when omitted)',
  })
  sortBy?: QuizSortBy

  @IsOptional()
  @IsEnum(SortOrder)
  @ApiPropertyOptional({ enum: SortOrder, description: 'sort direction (default is desc)' })
  sortOrder?: SortOrder

  @IsOptional()
  @Type(() => Number) // query param value arrive as string -> so convert it into number type
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'page number (1-based Returns 20 items per page)', minimum: 1, default: 1 })
  page?: number
}
