import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

export interface AuthUserData {
  userId: number
}

export const AuthUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUserData | undefined => {
  const request = ctx.switchToHttp().getRequest<Request>()
  return request.user
})
