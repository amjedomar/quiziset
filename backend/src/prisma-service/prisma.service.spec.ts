import { PrismaClient } from '@/generated/prisma/client'
import { PrismaService } from './prisma.service'

jest.mock('@/generated/prisma/client', () => ({
  PrismaClient: jest.fn(),
}))

const adapter = jest.fn()
jest.mock('@/utils/prisma-adapter', () => ({
  createPrismaAdapter: (...args: unknown[]) => adapter(...args),
}))

describe('PrismaService', () => {
  it('extends PrismaClient using the app db adapter', () => {
    adapter.mockReturnValue('the-adapter')

    new PrismaService()

    expect(PrismaClient).toHaveBeenCalledWith({ adapter: 'the-adapter' })
  })
})
