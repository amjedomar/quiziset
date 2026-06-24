import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty({ minimum: 1, maximum: 5, description: 'star rating from 1 to 5 (whole stars only)' })
  rating: number

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @ApiPropertyOptional({ description: 'optional text comment (max 255 chars)' })
  comment?: string
}
