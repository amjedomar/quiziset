import { Request, Response } from 'express'
import { AuthMiddleware } from './auth.middleware'

// the token verification logic is mocked so these tests focus on the middleware itself
// it is tested in "auth-token.spec.ts" instead
const verifyAccessToken = jest.fn()
jest.mock('@/utils/auth-token', () => ({
  verifyAccessToken: (...args: unknown[]) => verifyAccessToken(...args),
}))

describe('AuthMiddleware', () => {
  let jwtService: any
  let prisma: any
  let middleware: AuthMiddleware
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    jwtService = {}
    prisma = {}
    middleware = new AuthMiddleware(jwtService, prisma)
    res = {} as Response
    next = jest.fn()
  })

  it('sets req.user when the token is valid', async () => {
    const req = { headers: { authorization: 'Bearer the-token' } } as Request

    verifyAccessToken.mockResolvedValue(1)

    await middleware.use(req, res, next)

    expect(verifyAccessToken).toHaveBeenCalledWith(jwtService, prisma, 'the-token')
    expect(req.user).toEqual({ userId: 1 })
    expect(next).toHaveBeenCalled()
  })

  it('does not set req.user when there is no Authorization header', async () => {
    const req = { headers: {} } as Request

    await middleware.use(req, res, next)

    expect(verifyAccessToken).not.toHaveBeenCalled()
    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })

  it('does not set req.user when the token is invalid or revoked', async () => {
    const req = { headers: { authorization: 'Bearer bad-token' } } as Request

    verifyAccessToken.mockResolvedValue(null)

    await middleware.use(req, res, next)

    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })
})
