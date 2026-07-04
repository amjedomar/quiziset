import { Request, Response } from 'express'
import { AuthMiddleware } from './auth.middleware'

describe('AuthMiddleware', () => {
  let jwtService: any
  let prisma: any
  let middleware: AuthMiddleware
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() }
    prisma = { user: { findUnique: jest.fn() } }
    middleware = new AuthMiddleware(jwtService, prisma)
    res = {} as Response
    next = jest.fn()
  })

  it('sets req.user when the token is valid and the user exists', async () => {
    const req = { headers: { authorization: 'Bearer the-token' } } as Request

    jwtService.verifyAsync.mockResolvedValue({ userId: 1 })
    prisma.user.findUnique.mockResolvedValue({ id: 1 })

    await middleware.use(req, res, next)

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } })
    expect(req.user).toEqual({ userId: 1 })
    expect(next).toHaveBeenCalled()
  })

  it('does not set req.user when there is no Authorization header', async () => {
    const req = { headers: {} } as Request

    await middleware.use(req, res, next)

    expect(jwtService.verifyAsync).not.toHaveBeenCalled()
    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })

  it('does not set req.user when the token is invalid', async () => {
    const req = { headers: { authorization: 'Bearer invalid-token' } } as Request

    jwtService.verifyAsync.mockRejectedValue(new Error('invalid signature'))

    await middleware.use(req, res, next)

    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })

  it('does not set req.user when the token is valid but the user no longer exists', async () => {
    const req = { headers: { authorization: 'Bearer the-token' } } as Request

    jwtService.verifyAsync.mockResolvedValue({ userId: 1 })
    prisma.user.findUnique.mockResolvedValue(null)

    await middleware.use(req, res, next)

    expect(req.user).toBeUndefined()
    expect(next).toHaveBeenCalled()
  })
})
