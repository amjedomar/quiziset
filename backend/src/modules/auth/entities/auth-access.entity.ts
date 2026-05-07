import { ApiProperty } from '@nestjs/swagger'

export class AuthToken {
  @ApiProperty({ description: 'JWT Auth Access Token' })
  accessToken: string
}
