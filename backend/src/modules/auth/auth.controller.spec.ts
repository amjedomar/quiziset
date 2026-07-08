import { AuthController } from '@/modules/auth/auth.controller'

// the service is mocked so we only test that the controller delegates correctly
describe('AuthController', () => {
  let authService: any
  let controller: AuthController

  beforeEach(() => {
    authService = {
      signup: jest.fn(),
      login: jest.fn(),
      requestPasswordReset: jest.fn(),
      resetPassword: jest.fn(),
    }
    controller = new AuthController(authService)
  })

  it('delegates signup to the auth service and returns its result', async () => {
    const dto = { name: 'Amjed Omar', email: 'amjed@example.com', password: 'secret123' }
    const token = { accessToken: 'jwt-token' }

    authService.signup.mockResolvedValue(token)

    const result = await controller.signup(dto)

    expect(authService.signup).toHaveBeenCalledWith(dto)
    expect(result).toBe(token)
  })

  it('delegates login to the auth service and returns its result', async () => {
    const dto = { email: 'amjed@example.com', password: 'secret123' }
    const token = { accessToken: 'jwt-token' }

    authService.login.mockResolvedValue(token)

    const result = await controller.login(dto)

    expect(authService.login).toHaveBeenCalledWith(dto)
    expect(result).toBe(token)
  })

  it('delegates requestPasswordReset to the auth service and returns its result', async () => {
    const dto = { email: 'amjed@example.com' }
    const response = { previewUrl: 'http://localhost:1080' }

    authService.requestPasswordReset.mockResolvedValue(response)

    const result = await controller.requestPasswordReset(dto)

    expect(authService.requestPasswordReset).toHaveBeenCalledWith(dto)
    expect(result).toBe(response)
  })

  it('delegates resetPassword to the auth service and returns its result', async () => {
    const dto = { token: 'reset-token', password: 'new-secret' }
    const token = { accessToken: 'jwt-token' }

    authService.resetPassword.mockResolvedValue(token)

    const result = await controller.resetPassword(dto)

    expect(authService.resetPassword).toHaveBeenCalledWith(dto)
    expect(result).toBe(token)
  })
})
