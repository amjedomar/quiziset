import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { SignupDto } from '@/modules/auth/dto/signup.dto'
import { AuthToken } from '@/modules/auth/entities/auth-access.entity'
import { AuthErrors, AuthService } from '@/modules/auth/auth.service'
import { LoginDto } from '@/modules/auth/dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registers a new user' })
  @ApiResponse({
    status: 201,
    description: 'Returns access token',
    type: AuthToken,
  })
  @ApiResponse({ status: 422, description: 'Unprocessable Content' })
  @ApiResponse({
    status: 400,
    description: AuthErrors.USER_ALREADY_EXISTS,
  })
  async signup(@Body() signupDto: SignupDto): Promise<AuthToken> {
    return this.authService.signup(signupDto)
  }

  @Post('login')
  @ApiOperation({ summary: 'Logins User' })
  @ApiResponse({
    status: 200,
    description: 'Returns access token',
    type: AuthToken,
  })
  @ApiResponse({
    status: 401,
    description: AuthErrors.LOGIN_FAILED,
  })
  login(@Body() loginDto: LoginDto): Promise<AuthToken> {
    return this.authService.login(loginDto)
  }
}
