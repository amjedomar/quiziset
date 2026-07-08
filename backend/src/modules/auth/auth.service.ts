import { BadRequestException, InternalServerErrorException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaErrorCode, PrismaService } from '@/prisma-service'
import { AuthToken } from '@/modules/auth/entities/auth-access.entity'
import { PasswordResetRequestResponse } from '@/modules/auth/entities/password-reset-request.entity'
import { LoginDto } from '@/modules/auth/dto/login.dto'
import { SignupDto } from '@/modules/auth/dto/signup.dto'
import { RequestPasswordResetDto } from '@/modules/auth/dto/request-password-reset.dto'
import { ResetPasswordDto } from '@/modules/auth/dto/reset-password.dto'
import { MailService } from '@/modules/mail/mail.service'
import {
  buildAccessTokenPayload,
  buildResetTokenPayload,
  isTokenRevokedByPasswordChange,
  parseResetTokenPayload,
  PASSWORD_RESET_EXPIRY,
} from '@/utils/auth-token'
import * as Prisma from '@/generated/prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import argon2 from 'argon2'

export const AuthErrors = {
  LOGIN_FAILED: 'Login failed: either the email or password is incorrect',
  USER_ALREADY_EXISTS: 'User with the same email already exists (please login instead)',
  EMAIL_NOT_FOUND: 'No account was found with this email',
  RESET_LINK_INVALID: 'This password reset link is invalid or has expired (please request a new one)',
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  private async generateAccessToken(user: Prisma.User) {
    return await this.jwtService.signAsync(buildAccessTokenPayload(user))
  }

  async signup(signupDto: SignupDto): Promise<AuthToken> {
    let newUser: Prisma.User

    try {
      const hashedPassword = await argon2.hash(signupDto.password)

      const newUserData = {
        name: signupDto.name,
        email: signupDto.email,
        password: hashedPassword,
      }

      newUser = await this.prisma.user.create({
        data: newUserData,
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === PrismaErrorCode.UniqueConstraintViolation) {
        throw new BadRequestException(AuthErrors.USER_ALREADY_EXISTS)
      }

      throw new InternalServerErrorException()
    }

    const accessToken = await this.generateAccessToken(newUser)

    return { accessToken }
  }

  async login(loginDto: LoginDto): Promise<AuthToken> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    })

    if (!user) {
      throw new BadRequestException(AuthErrors.LOGIN_FAILED)
    }

    const isPasswordMatch = await argon2.verify(user.password, loginDto.password)

    if (!isPasswordMatch) {
      throw new BadRequestException(AuthErrors.LOGIN_FAILED)
    }

    const accessToken = await this.generateAccessToken(user)

    return { accessToken }
  }

  async requestPasswordReset(dto: RequestPasswordResetDto): Promise<PasswordResetRequestResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })

    if (!user) {
      throw new BadRequestException(AuthErrors.EMAIL_NOT_FOUND)
    }

    const resetToken = await this.jwtService.signAsync(buildResetTokenPayload(user), {
      expiresIn: PASSWORD_RESET_EXPIRY,
    })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

    await this.mailService.sendPasswordResetEmail(user.email, resetUrl)

    // only set in development (see "MAIL_PREVIEW_URL" in ".env.sample") so the emailed
    // link can be opened via the mailcatcher web UI but it should be empty in production
    const previewUrl = process.env.MAIL_PREVIEW_URL || undefined

    return { previewUrl }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<AuthToken> {
    let decoded: unknown

    try {
      decoded = await this.jwtService.verifyAsync(dto.token)
    } catch {
      throw new BadRequestException(AuthErrors.RESET_LINK_INVALID)
    }

    const payload = parseResetTokenPayload(decoded)

    if (!payload) {
      throw new BadRequestException(AuthErrors.RESET_LINK_INVALID)
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.userId } })

    // reject if the user was deleted or the link was already used (a used link no longer
    // matches the current "passwordLastChangedAt")
    if (!user || isTokenRevokedByPasswordChange(payload.pwdChangedAt, user)) {
      throw new BadRequestException(AuthErrors.RESET_LINK_INVALID)
    }

    const hashedPassword = await argon2.hash(dto.password)

    // changing "passwordLastChangedAt" to current date to revoke every previously issued token :)
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, passwordLastChangedAt: new Date() },
    })

    // issue a fresh token so the user is logged in immediately after resetting
    const accessToken = await this.generateAccessToken(updatedUser)

    return { accessToken }
  }
}
