import {
  buildAccessTokenPayload,
  buildResetTokenPayload,
  isTokenRevokedByPasswordChange,
  parseResetTokenPayload,
  PASSWORD_RESET_PURPOSE,
  verifyAccessToken,
} from './auth-token'
import { PASSWORD_LAST_CHANGED_AT, USER_ID, makeUserRecord } from '@/test-utils/mocks'

const PWD_CHANGED_AT = PASSWORD_LAST_CHANGED_AT.getTime()

describe('auth-token payloads', () => {
  it('builds the access token payload from the user', () => {
    expect(buildAccessTokenPayload(makeUserRecord())).toEqual({ userId: USER_ID, pwdChangedAt: PWD_CHANGED_AT })
  })

  it('builds the reset token payload with the reset "purpose" attr', () => {
    expect(buildResetTokenPayload(makeUserRecord())).toEqual({
      userId: USER_ID,
      pwdChangedAt: PWD_CHANGED_AT,
      purpose: PASSWORD_RESET_PURPOSE,
    })
  })

  it('parses a valid reset token payload', () => {
    const payload = { userId: USER_ID, pwdChangedAt: PWD_CHANGED_AT, purpose: PASSWORD_RESET_PURPOSE }

    expect(parseResetTokenPayload(payload)).toEqual(payload)
  })

  it('rejects a payload that is missing the reset "purpose" attr', () => {
    expect(parseResetTokenPayload({ userId: USER_ID, pwdChangedAt: PWD_CHANGED_AT })).toBeNull()
  })
})

describe('isTokenRevokedByPasswordChange', () => {
  it('revokes a token issued before the last password change', () => {
    expect(isTokenRevokedByPasswordChange(PWD_CHANGED_AT - 1, makeUserRecord())).toBe(true)
  })

  it('keeps a token that is issued at or after the last password change', () => {
    expect(isTokenRevokedByPasswordChange(PWD_CHANGED_AT, makeUserRecord())).toBe(false)
    expect(isTokenRevokedByPasswordChange(PWD_CHANGED_AT + 1, makeUserRecord())).toBe(false)
  })
})

describe('verifyAccessToken', () => {
  let jwtService: any
  let prisma: any

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() }
    prisma = { user: { findUnique: jest.fn() } }
  })

  it('returns the userId for a valid access token', async () => {
    jwtService.verifyAsync.mockResolvedValue({ userId: USER_ID, pwdChangedAt: PWD_CHANGED_AT })
    prisma.user.findUnique.mockResolvedValue(makeUserRecord())

    expect(await verifyAccessToken(jwtService, prisma, 'the-token')).toBe(USER_ID)
  })

  it('returns null when the token cannot be verified', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid signature'))

    expect(await verifyAccessToken(jwtService, prisma, 'bad-token')).toBeNull()
  })

  it('returns null for a password reset token (since normal auth access token shouldn\'t include "purpose" attr)', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      userId: USER_ID,
      pwdChangedAt: PWD_CHANGED_AT,
      purpose: PASSWORD_RESET_PURPOSE,
    })

    expect(await verifyAccessToken(jwtService, prisma, 'reset-token')).toBeNull()
    expect(prisma.user.findUnique).not.toHaveBeenCalled()
  })

  it('returns null when the user no longer exists', async () => {
    jwtService.verifyAsync.mockResolvedValue({ userId: USER_ID, pwdChangedAt: PWD_CHANGED_AT })
    prisma.user.findUnique.mockResolvedValue(null)

    expect(await verifyAccessToken(jwtService, prisma, 'the-token')).toBeNull()
  })

  it('returns null when the token was issued before the last password change', async () => {
    jwtService.verifyAsync.mockResolvedValue({ userId: USER_ID, pwdChangedAt: PWD_CHANGED_AT - 1 })
    prisma.user.findUnique.mockResolvedValue(makeUserRecord())

    expect(await verifyAccessToken(jwtService, prisma, 'stale-token')).toBeNull()
  })
})
