import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, Length } from 'class-validator'
import { IsLocalImagePath } from '@/decorators/is-local-image-path'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 64)
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'name length must be between 2 and 64 characters',
  })
  name?: string

  @IsOptional()
  @IsEmail({}, { message: 'Email is invalid' })
  @Length(0, 255)
  @ApiPropertyOptional({
    example: 'amjed@example.com',
    description: 'a valid email address (max length: 255)',
  })
  email?: string

  @IsOptional()
  @IsString()
  @IsLocalImagePath()
  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: '/uploads/profiles/avatar.png',
    description: 'a local image path (starts with /uploads or /public) or null to remove the image',
  })
  imageUrl?: string | null
}
