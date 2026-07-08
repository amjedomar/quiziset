import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction, Request, Response } from 'express'
import { PrismaService } from '@/prisma-service'
import { verifyAccessToken } from '@/utils/auth-token'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * extracts token from "Authorization" header
   */
  private extractAuthToken(req: Request): string | null {
    const { authorization } = req.headers

    if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
      return null
    }

    return authorization.slice('Bearer '.length)
  }

  /**
   * middleware logic is coded here (set "req.user" if user is authenticated)
   */
  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractAuthToken(req)

    if (!token) {
      return next()
    }

    // "verifyAccessToken" verifies the token (but keep in mind that it
    // rejects it if the token was issued before the user's last password change)
    const userId = await verifyAccessToken(this.jwtService, this.prisma, token)

    if (userId) {
      req.user = { userId }
    }

    next()
  }
}
