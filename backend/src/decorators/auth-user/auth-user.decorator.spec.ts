import { ExecutionContext } from '@nestjs/common'
import { AuthUser, AuthUserData } from './auth-user.decorator'

type AuthUserFactory = (data: unknown, ctx: ExecutionContext) => AuthUserData | undefined

/**
 * we just need to test the factory inside "createParamDecorator"
 * as recommended by Nest.js creator
 * see https://github.com/nestjs/nest/issues/1020#issuecomment-417646366
 */
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  createParamDecorator: (factory: AuthUserFactory) => factory,
}))

describe('AuthUser', () => {
  it("returns the request's user", () => {
    const mockContext = {
      switchToHttp: () => ({ getRequest: () => ({ user: { userId: 1 } }) }),
    } as ExecutionContext

    expect((AuthUser as unknown as AuthUserFactory)(null, mockContext)).toEqual({ userId: 1 })
  })
})
