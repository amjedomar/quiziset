import { IsEmail, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignupDto {
  @IsString()
  @Length(2, 64)
  @ApiProperty({
    example: 'John Doe',
    description: 'name length must be between 2 and 64 characters',
  })
  readonly name: string

  @IsEmail({}, { message: 'Email is invalid' })
  @Length(1, 255)
  @ApiProperty({
    example: 'amjed@example.com',
    description: 'A valid email address (max length: 255)',
  })
  readonly email: string

  @IsString()
  @Length(8)
  @ApiProperty({
    example: 'ABC12345',
    description: 'Password length must be 8 at least',
  })
  readonly password: string
}
