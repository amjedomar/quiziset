import { ApiProperty } from '@nestjs/swagger'

export class ReviewEntity {
  @ApiProperty() id: number

  @ApiProperty({ minimum: 1, maximum: 5, description: 'star rating from 1 to 5 (whole stars only)' })
  rating: number

  @ApiProperty({ type: String, nullable: true }) comment: string | null

  @ApiProperty({ description: 'display name of the review author' })
  authorName: string

  @ApiProperty({ description: 'true when this review belongs to the current (authenticated) user' })
  isMine: boolean

  @ApiProperty() createdAt: Date

  @ApiProperty() updatedAt: Date
}
