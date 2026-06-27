import { ApiProperty } from '@nestjs/swagger'

/**
 * the full profile of the current (authenticated) user
 *
 * (except "password" field)
 */
export class UserEntity {
  @ApiProperty() id: number

  @ApiProperty() name: string

  @ApiProperty() email: string

  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null
}
