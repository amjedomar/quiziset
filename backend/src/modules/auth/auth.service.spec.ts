import { AuthService, AuthErrors } from '@/modules/auth/auth.service'
import { PASSWORD_LAST_CHANGED_AT, USER_ID, makeUserRecord } from '@/test-utils/mocks'
import { PASSWORD_RESET_PURPOSE } from '@/utils/auth-token'
import argon2 from 'argon2'

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  verify: jest.fn().mockResolvedValue(true),
}))

// the payload that should be included in every access token (see "buildAccessTokenPayload")
// the token includes the last password-change timestamp (so it is revoked once the password is changed)
const ACCESS_TOKEN_PAYLOAD = { userId: USER_ID, pwdChangedAt: PASSWORD_LAST_CHANGED_AT.getTime() }

describe('AuthService', () => {
  let prisma: any
  let jwtService: any
  let mailService: any
  let service: AuthService

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    }
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('jwt-token'),
      verifyAsync: jest.fn(),
    }
    mailService = {
      sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    }
    service = new AuthService(prisma, jwtService, mailService)
  })

  it('creates a user on signup and returns the access token', async () => {
    prisma.user.create.mockResolvedValue(makeUserRecord())

    const result = await service.signup({ name: 'Amjed Omar', email: 'amjed@example.com', password: 'secret123' })

    expect(argon2.hash).toHaveBeenCalledWith('secret123')

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Amjed Omar',
        email: 'amjed@example.com',
        password: 'hashed-password', // this make sure that the password is stored hashed
      },
    })

    expect(jwtService.signAsync).toHaveBeenCalledWith(ACCESS_TOKEN_PAYLOAD)
    expect(result).toEqual({ accessToken: 'jwt-token' })
  })

  it('returns the access token on a valid login', async () => {
    prisma.user.findUnique.mockResolvedValue(makeUserRecord())

    const result = await service.login({ email: 'amjed@example.com', password: 'secret123' })

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'amjed@example.com' } })
    expect(argon2.verify).toHaveBeenCalledWith('hashed-password', 'secret123')
    expect(jwtService.signAsync).toHaveBeenCalledWith(ACCESS_TOKEN_PAYLOAD)
    expect(result).toEqual({ accessToken: 'jwt-token' })
  })

  describe('requestPasswordReset', () => {
    beforeEach(() => {
      process.env.FRONTEND_URL = 'http://localhost:3003'
      process.env.MAIL_PREVIEW_URL = 'http://localhost:1080'
    })

    it('throws when no account exists with the given email', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      await expect(service.requestPasswordReset({ email: 'non-existing-user@example.com' })).rejects.toThrow(
        AuthErrors.EMAIL_NOT_FOUND,
      )
      expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled()
    })

    it('emails a reset link and returns the mailcatcher preview url (in development mode only)', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUserRecord())

      const result = await service.requestPasswordReset({ email: 'amjed@example.com' })

      expect(mailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'amjed@example.com',
        'http://localhost:3003/reset-password?token=jwt-token',
      )
      expect(result).toEqual({ previewUrl: 'http://localhost:1080' })
    })
  })

  describe('resetPassword', () => {
    const validResetPayload = { ...ACCESS_TOKEN_PAYLOAD, purpose: PASSWORD_RESET_PURPOSE }

    it('throws when the token is invalid or expired', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('invalid signature'))

      await expect(service.resetPassword({ token: 'bad-token', password: 'new-secret' })).rejects.toThrow(
        AuthErrors.RESET_LINK_INVALID,
      )
      expect(prisma.user.update).not.toHaveBeenCalled()
    })

    it("throws when the token is a normal auth access token (i.e. when there isn't 'purpose': 'password-reset')", async () => {
      jwtService.verifyAsync.mockResolvedValue(ACCESS_TOKEN_PAYLOAD)

      await expect(service.resetPassword({ token: 'access-token', password: 'new-secret' })).rejects.toThrow(
        AuthErrors.RESET_LINK_INVALID,
      )
      expect(prisma.user.update).not.toHaveBeenCalled()
    })

    it('updates the password and returns a fresh access token', async () => {
      jwtService.verifyAsync.mockResolvedValue(validResetPayload)
      prisma.user.findUnique.mockResolvedValue(makeUserRecord())
      // the updated user includes a newer passwordLastChangedAt
      const newChangedAt = new Date('2026-02-01T10:00:00.000Z')
      prisma.user.update.mockResolvedValue(makeUserRecord({ passwordLastChangedAt: newChangedAt }))

      const result = await service.resetPassword({ token: 'reset-token', password: 'new-secret' })

      expect(argon2.hash).toHaveBeenCalledWith('new-secret')
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: USER_ID },
        data: expect.objectContaining({ password: 'hashed-password' }),
      })
      // the new token includes the new `pwdChangedAt` timestamp (which revokes the older tokens)
      expect(jwtService.signAsync).toHaveBeenCalledWith({ userId: USER_ID, pwdChangedAt: newChangedAt.getTime() })
      expect(result).toEqual({ accessToken: 'jwt-token' })
    })
  })
})
