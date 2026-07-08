import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordDto {
  @IsString()
  @ApiProperty({ description: 'the reset token from the emailed link' })
  readonly token: string

  @IsString()
  @Length(8)
  @ApiProperty({
    example: 'ABC12345',
    description: 'Password length must be 8 at least',
  })
  readonly password: string
}
