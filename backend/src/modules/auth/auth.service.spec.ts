import { AuthService } from '@/modules/auth/auth.service'
import { USER_ID } from '@/test-utils/fixtures'
import argon2 from 'argon2'

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  verify: jest.fn().mockResolvedValue(true),
}))

describe('AuthService', () => {
  let prisma: any
  let jwtService: any
  let service: AuthService

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    }
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('jwt-token'),
    }
    service = new AuthService(prisma, jwtService)
  })

  it('creates a user on signup and returns the access token', async () => {
    prisma.user.create.mockResolvedValue({ id: USER_ID })

    const result = await service.signup({ name: 'Amjed Omar', email: 'amjed@example.com', password: 'secret123' })

    expect(argon2.hash).toHaveBeenCalledWith('secret123')

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Amjed Omar',
        email: 'amjed@example.com',
        password: 'hashed-password', // this make sure that the password is stored hashed
      },
    })

    expect(jwtService.signAsync).toHaveBeenCalledWith({ userId: USER_ID })
    expect(result).toEqual({ accessToken: 'jwt-token' })
  })

  it('returns the access token on a valid login', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: USER_ID, password: 'hashed-password' })

    const result = await service.login({ email: 'amjed@example.com', password: 'secret123' })

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'amjed@example.com' } })
    expect(argon2.verify).toHaveBeenCalledWith('hashed-password', 'secret123')
    expect(jwtService.signAsync).toHaveBeenCalledWith({ userId: USER_ID })
    expect(result).toEqual({ accessToken: 'jwt-token' })
  })
})
