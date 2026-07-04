import { Body, Controller, Get, Patch } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { UserService } from '@/modules/user/user.service'
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto'
import { UserEntity } from '@/modules/user/entities/user.entity'
import { AuthUser } from '@/decorators/auth-user'
import type { AuthUserData } from '@/decorators/auth-user'
import { ApiResponsesList } from '@/decorators/api-responses-list'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'get the current user profile' })
  @ApiResponsesList({ status: 200, type: UserEntity }, 401, 404)
  getMe(@AuthUser() user: AuthUserData): Promise<UserEntity> {
    return this.userService.getMe(user.userId)
  }

  @Patch('me')
  @ApiOperation({ summary: 'update the current user profile' })
  @ApiResponsesList({ status: 200, type: UserEntity }, 400, 401, 404, 422)
  updateMe(@Body() dto: UpdateUserDto, @AuthUser() user: AuthUserData): Promise<UserEntity> {
    return this.userService.updateMe(user.userId, dto)
  }
}
