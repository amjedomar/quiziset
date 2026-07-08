import { IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RequestPasswordResetDto {
  @IsEmail({}, { message: 'Email is invalid' })
  @ApiProperty({ example: 'amjed@example.com' })
  readonly email: string
}
