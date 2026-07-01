import { UserService } from '@/modules/user/user.service'
import { makeUserRecord, makeUserEntity, USER_ID } from '@/test-utils/fixtures'

describe('UserService', () => {
  let prisma: any
  let service: UserService

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    }
    service = new UserService(prisma)
  })

  it('returns the current user profile without the password', async () => {
    const profile = makeUserEntity()
    prisma.user.findUnique.mockResolvedValue(profile)

    const result = await service.getMe(USER_ID)

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: USER_ID }, omit: { password: true } })
    expect(result).toEqual(profile)
  })

  it('updates the current user profile and returns it without the password', async () => {
    prisma.user.findUnique.mockResolvedValue(makeUserRecord())
    const updated = makeUserEntity({ name: 'new name' })
    prisma.user.update.mockResolvedValue(updated)

    const result = await service.updateMe(USER_ID, { name: 'new name' })

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: USER_ID },
      data: { name: 'new name' },
      omit: { password: true },
    })
    expect(result).toEqual(updated)
  })
})
