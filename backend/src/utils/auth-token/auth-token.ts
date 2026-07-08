import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/prisma-service'
import * as Prisma from '@/generated/prisma/client'

// marks a JWT token as a password reset token
// (so a reset link can't use a normal JWT access token and vice versa)
export const PASSWORD_RESET_PURPOSE = 'password-reset'

// how long a password reset link stays valid
export const PASSWORD_RESET_EXPIRY = '3h'

interface AccessTokenPayload {
  userId: number
  // when the user last changed their password (value is in milliseconds)
  // I included it so a password change revokes every token issued before it :)
  pwdChangedAt: number
}

// this extends AccessTokenPayload (and add the "purpose" which is 'password-reset')
interface ResetTokenPayload extends AccessTokenPayload {
  purpose: typeof PASSWORD_RESET_PURPOSE
}

/**
 * builds the payload that is included in a normal access token
 */
export function buildAccessTokenPayload(user: Prisma.User): AccessTokenPayload {
  return { userId: user.id, pwdChangedAt: user.passwordLastChangedAt.getTime() }
}

/**
 * builds the payload that is included in a password reset token
 */
export function buildResetTokenPayload(user: Prisma.User): ResetTokenPayload {
  return { ...buildAccessTokenPayload(user), purpose: PASSWORD_RESET_PURPOSE }
}

/**
 * validates the decoded access token payload schema
 * a token that includes a "purpose" (e.g. a reset password token) is rejected here
 * (since "purpose" attr is only used for a reset password token not the normal auth access token)
 */
function parseAccessTokenPayload(decoded: unknown): AccessTokenPayload | null {
  if (
    decoded instanceof Object &&
    'userId' in decoded &&
    typeof decoded.userId === 'number' &&
    'pwdChangedAt' in decoded &&
    typeof decoded.pwdChangedAt === 'number' &&
    !('purpose' in decoded)
  ) {
    return { userId: decoded.userId, pwdChangedAt: decoded.pwdChangedAt }
  }

  return null
}

/**
 * validates the decoded password reset token payload schema
 */
export function parseResetTokenPayload(decoded: unknown): ResetTokenPayload | null {
  if (
    decoded instanceof Object &&
    'userId' in decoded &&
    typeof decoded.userId === 'number' &&
    'pwdChangedAt' in decoded &&
    typeof decoded.pwdChangedAt === 'number' &&
    'purpose' in decoded &&
    decoded.purpose === PASSWORD_RESET_PURPOSE
  ) {
    return { userId: decoded.userId, pwdChangedAt: decoded.pwdChangedAt, purpose: PASSWORD_RESET_PURPOSE }
  }

  return null
}

/**
 * true when a token was issued before the user's last password change
 */
export function isTokenRevokedByPasswordChange(pwdChangedAt: number, user: Prisma.User): boolean {
  return pwdChangedAt < user.passwordLastChangedAt.getTime()
}

/**
 * verifies an access token and returns the userId when valid (otherwise null)
 *
 * besides the signature/expiry check
 * it also rejects any token that was issued before the user's last password change
 */
export async function verifyAccessToken(
  jwtService: JwtService,
  prisma: PrismaService,
  token: string,
): Promise<number | null> {
  let decoded: unknown

  try {
    decoded = await jwtService.verifyAsync(token)
  } catch {
    // invalid/expired token
    return null
  }

  const payload = parseAccessTokenPayload(decoded)

  if (!payload) {
    return null
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })

  if (!user || isTokenRevokedByPasswordChange(payload.pwdChangedAt, user)) {
    return null
  }

  return user.id
}
