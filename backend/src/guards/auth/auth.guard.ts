import { IS_PUBLIC_METADATA } from '@/decorators/is-public'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

/**
 * This "AuthGuard" is used globally in "app.module.ts"
 *
 * It is applied to each request (unless you used "@IsPublic")
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    /**
     * "getAllAndOverride" will get the metadata
     * attached to the Controller (or to the method if overridden)
     * see https://docs.nestjs.com/fundamentals/execution-context
     */
    const isPublicRequest = this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_METADATA, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublicRequest) {
      // this is a public request (no need for authentication) return true
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()

    // btw "request.user" is set in "auth.middleware.ts"
    const user = request.user

    if (!user) {
      throw new UnauthorizedException()
    }

    return true
  }
}
