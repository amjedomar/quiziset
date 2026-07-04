import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from './auth.guard'

function makeContext(user: { userId: number } | undefined): ExecutionContext {
  return {
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext
}

describe('AuthGuard', () => {
  let getAllAndOverride: jest.Mock
  let guard: AuthGuard

  beforeEach(() => {
    getAllAndOverride = jest.fn()
    guard = new AuthGuard({ getAllAndOverride } as unknown as Reflector)
  })

  it('allows a public request even without a logged-in user', () => {
    getAllAndOverride.mockReturnValue(true)

    expect(guard.canActivate(makeContext(undefined))).toBe(true)
  })

  it('allows a private request when the user is authenticated', () => {
    getAllAndOverride.mockReturnValue(false)

    expect(guard.canActivate(makeContext({ userId: 1 }))).toBe(true)
  })

  it('throws when the request is private and there is no authenticated user', () => {
    getAllAndOverride.mockReturnValue(false)

    expect(() => guard.canActivate(makeContext(undefined))).toThrow(UnauthorizedException)
  })
})
