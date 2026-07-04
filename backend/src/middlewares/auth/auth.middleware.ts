import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction, Request, Response } from 'express'
import { PrismaService } from '@/prisma-service'

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
   * in case verification succeed then userId will be returned
   * otherwise it will return null
   */
  private async verifyToken(token: string): Promise<number | null> {
    try {
      const decoded = (await this.jwtService.verifyAsync(token)) as unknown

      if (decoded instanceof Object && 'userId' in decoded && typeof decoded?.userId === 'number') {
        return decoded.userId
      }

      return null
    } catch {
      return null
    }
  }

  /**
   * middleware logic is coded here (set "req.user" if user is authenticated)
   */
  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractAuthToken(req)

    if (!token) {
      return next()
    }

    const userId = await this.verifyToken(token)

    if (!userId) {
      return next()
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    // only set "req.user" if user exists in database
    if (user) {
      req.user = {
        userId: user.id,
      }
    }

    next()
  }
}
