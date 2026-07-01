import { UserController } from '@/modules/user/user.controller'
import { makeUserEntity, REQ_USER } from '@/test-utils/fixtures'

// the service is mocked so we only test that the controller delegates correctly
describe('UserController', () => {
  let userService: any
  let controller: UserController

  beforeEach(() => {
    userService = { getMe: jest.fn(), updateMe: jest.fn() }
    controller = new UserController(userService)
  })

  it('delegates getting the current user profile to the service and returns its result', async () => {
    const profile = makeUserEntity()

    userService.getMe.mockResolvedValue(profile)

    const result = await controller.getMe(REQ_USER)

    expect(userService.getMe).toHaveBeenCalledWith(REQ_USER.userId)
    expect(result).toBe(profile)
  })

  it('delegates updating the current user profile to the service and returns its result', async () => {
    const dto = { name: 'new name' }
    const profile = makeUserEntity({ name: 'new name' })

    userService.updateMe.mockResolvedValue(profile)

    const result = await controller.updateMe(dto, REQ_USER)

    expect(userService.updateMe).toHaveBeenCalledWith(REQ_USER.userId, dto)
    expect(result).toBe(profile)
  })
})
