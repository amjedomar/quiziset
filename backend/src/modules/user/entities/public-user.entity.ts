import { ApiProperty } from '@nestjs/swagger'

export const PUBLIC_USER_INCLUDE = { id: true, name: true, imageUrl: true } as const

/**
 * the public data of a user that is returned on other responses
 * (e.g. as a quiz creator or a review author)
 */
export class PublicUserEntity {
  @ApiProperty() id: number

  @ApiProperty() name: string

  @ApiProperty({ type: String, nullable: true })
  imageUrl: string | null
}
