import { BadRequestException, InternalServerErrorException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaErrorCode, PrismaService } from '@/prisma.service'
import { AuthToken } from '@/modules/auth/entities/auth-access.entity'
import { LoginDto } from '@/modules/auth/dto/login.dto'
import { SignupDto } from '@/modules/auth/dto/signup.dto'
import * as Prisma from '@/generated/prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import argon2 from 'argon2'

export const AuthErrors = {
  LOGIN_FAILED: 'Login failed: either the email or password is incorrect',
  USER_ALREADY_EXISTS: 'User with the same email already exists. Please login instead',
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async generateAccessToken(userId: number) {
    return await this.jwtService.signAsync({ userId })
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

    const accessToken = await this.generateAccessToken(newUser.id)

    return { accessToken }
  }

  async login(loginDto: LoginDto): Promise<AuthToken> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    })

    if (!user) {
      throw new UnauthorizedException(AuthErrors.LOGIN_FAILED)
    }

    const isPasswordMatch = await argon2.verify(user.password, loginDto.password)

    if (!isPasswordMatch) {
      throw new UnauthorizedException(AuthErrors.LOGIN_FAILED)
    }

    const accessToken = await this.generateAccessToken(user.id)

    return { accessToken }
  }
}
