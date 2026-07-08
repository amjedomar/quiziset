import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { SignupDto } from '@/modules/auth/dto/signup.dto'
import { AuthToken } from '@/modules/auth/entities/auth-access.entity'
import { PasswordResetRequestResponse } from '@/modules/auth/entities/password-reset-request.entity'
import { AuthErrors, AuthService } from '@/modules/auth/auth.service'
import { LoginDto } from '@/modules/auth/dto/login.dto'
import { RequestPasswordResetDto } from '@/modules/auth/dto/request-password-reset.dto'
import { ResetPasswordDto } from '@/modules/auth/dto/reset-password.dto'
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

  @Post('request-password-reset')
  @ApiOperation({ summary: 'Sends a password reset email' })
  @ApiResponsesList(
    {
      status: 201,
      description: 'Reset password email sent (returns the mailcatcher preview url in development only)',
      type: PasswordResetRequestResponse,
    },
    { status: 400, description: AuthErrors.EMAIL_NOT_FOUND },
    422,
  )
  requestPasswordReset(@Body() dto: RequestPasswordResetDto): Promise<PasswordResetRequestResponse> {
    return this.authService.requestPasswordReset(dto)
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Resets the password and logs the user in' })
  @ApiResponsesList(
    {
      status: 201,
      description: 'Returns access token',
      type: AuthToken,
    },
    { status: 400, description: AuthErrors.RESET_LINK_INVALID },
    422,
  )
  resetPassword(@Body() dto: ResetPasswordDto): Promise<AuthToken> {
    return this.authService.resetPassword(dto)
  }
}
