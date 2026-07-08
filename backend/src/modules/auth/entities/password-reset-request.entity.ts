import { ApiProperty } from '@nestjs/swagger'

export class PasswordResetRequestResponse {
  @ApiProperty({
    required: false,
    description:
      'link to the mailcatcher web UI so the email can be opened easily (only returned in development only it is empty in production)',
  })
  previewUrl?: string
}
