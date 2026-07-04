import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { SignupDto } from '@/modules/auth/dto/signup.dto'
import { AuthToken } from '@/modules/auth/entities/auth-access.entity'
import { AuthErrors, AuthService } from '@/modules/auth/auth.service'
import { LoginDto } from '@/modules/auth/dto/login.dto'
import { IsPublic } from '@/decorators/is-public'
import { ApiResponsesList } from '@/decorators/api-responses-list'

@Controller('auth')
@IsPublic()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registers a new user' })
  @ApiResponsesList(
    {
      status: 201,
      description: 'Returns access token',
      type: AuthToken,
    },
    { status: 400, description: AuthErrors.USER_ALREADY_EXISTS },
    422,
  )
  async signup(@Body() signupDto: SignupDto): Promise<AuthToken> {
    return this.authService.signup(signupDto)
  }

  @Post('login')
  @ApiOperation({ summary: 'Logins User' })
  @ApiResponsesList(
    {
      status: 200,
      description: 'Returns access token',
      type: AuthToken,
    },
    { status: 400, description: AuthErrors.LOGIN_FAILED },
  )
  login(@Body() loginDto: LoginDto): Promise<AuthToken> {
    return this.authService.login(loginDto)
  }
}
