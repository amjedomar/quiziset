import { ApiProperty } from '@nestjs/swagger'
import { PublicUserEntity } from '@/modules/user/entities/public-user.entity'

export class ReviewEntity {
  @ApiProperty() id: number

  @ApiProperty({ minimum: 1, maximum: 5, description: 'star rating from 1 to 5 (whole stars only)' })
  rating: number

  @ApiProperty({ type: String, nullable: true }) comment: string | null

  @ApiProperty({ type: PublicUserEntity, description: 'the review author' })
  author: PublicUserEntity

  @ApiProperty({ description: 'true when this review belongs to the current (authenticated) user' })
  isMine: boolean

  @ApiProperty() createdAt: Date

  @ApiProperty() updatedAt: Date
}
