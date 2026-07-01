import { AuthController } from '@/modules/auth/auth.controller'

// the service is mocked so we only test that the controller delegates correctly
describe('AuthController', () => {
  let authService: any
  let controller: AuthController

  beforeEach(() => {
    authService = { signup: jest.fn(), login: jest.fn() }
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
})
