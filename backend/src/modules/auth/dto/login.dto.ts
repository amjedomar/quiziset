import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @IsEmail({}, { message: 'Email is invalid' })
  @ApiProperty({ example: 'johndoe@example.com' })
  readonly email: string

  @IsString()
  @ApiProperty({ example: 'ABC12345' })
  readonly password: string
}
