import { ForbiddenException, StreamableFile } from '@nestjs/common'
import { createReadStream } from 'fs'
import { UploadsService } from '@/modules/uploads/uploads.service'
import { BucketName } from '@/modules/uploads/dto/upload-params.dto'
import { USER_ID } from '@/test-utils/mocks'

// the filesystem and helpers are mocked so nothing is actually read or written to disk
jest.mock('fs', () => ({
  createReadStream: jest.fn(() => ({ pipe: jest.fn() })),
}))

const createUploadedFile = jest.fn()
const getUploadedFilePath = jest.fn()
const deleteUploadedFile = jest.fn()
jest.mock('@/utils/uploads-management/uploads-fs', () => ({
  createUploadedFile: (...args: unknown[]) => createUploadedFile(...args),
  getUploadedFilePath: (...args: unknown[]) => getUploadedFilePath(...args),
  deleteUploadedFile: (...args: unknown[]) => deleteUploadedFile(...args),
}))

// the access decision is mocked so these tests stay focused on the service logic itself :)
// it is tested in "uploads-access.spec.ts" instead
const canViewQuizUpload = jest.fn()
jest.mock('@/utils/uploads-management/uploads-access', () => ({
  canViewQuizUpload: (...args: unknown[]) => canViewQuizUpload(...args),
  USER_TOKEN_COOKIE: 'quiziset-user-token',
}))

// the token verification logic is mocked so these tests focus on the middleware itself
// it is tested in "auth-token.spec.ts" instead
const verifyAccessToken = jest.fn()
jest.mock('@/utils/auth-token', () => ({
  verifyAccessToken: (...args: unknown[]) => verifyAccessToken(...args),
}))

describe('UploadsService', () => {
  let prisma: any
  let jwtService: any
  let service: UploadsService

  beforeEach(() => {
    jest.clearAllMocks()
    getUploadedFilePath.mockResolvedValue('/uploads/quizzes/pic.png')
    canViewQuizUpload.mockResolvedValue(true)

    prisma = {
      quizUpload: {
        create: jest.fn().mockResolvedValue(undefined),
        findUnique: jest.fn(),
        delete: jest.fn().mockResolvedValue(undefined),
      },
    }
    jwtService = { verifyAsync: jest.fn() }

    service = new UploadsService(prisma, jwtService)
  })

  describe('upload', () => {
    it('saves a quizzes image and records the upload row and returns its url', async () => {
      createUploadedFile.mockResolvedValue('generated-name.png')
      const file = { originalname: 'pic.png', buffer: Buffer.from('image-data') }

      const result = await service.upload(BucketName.Quizzes, file as any, USER_ID)

      expect(createUploadedFile).toHaveBeenCalledWith('quizzes', file.buffer, '.png')
      expect(prisma.quizUpload.create).toHaveBeenCalledWith({
        data: { bucket: 'quizzes', fileName: 'generated-name.png', ownerId: USER_ID },
      })
      expect(result.url).toBe('/uploads/quizzes/generated-name.png')
    })

    it('does not record an upload row for a profiles (avatar) image', async () => {
      createUploadedFile.mockResolvedValue('avatar.png')
      const file = { originalname: 'avatar.png', buffer: Buffer.from('image-data') }

      await service.upload(BucketName.Profiles, file as any, USER_ID)

      expect(prisma.quizUpload.create).not.toHaveBeenCalled()
    })
  })

  describe('getFile', () => {
    it('return a stream of a quiz image when access is allowed', async () => {
      canViewQuizUpload.mockResolvedValue(true)

      const result = await service.getFile(BucketName.Quizzes, 'pic.png', undefined)

      expect(canViewQuizUpload).toHaveBeenCalledWith(prisma, 'pic.png', undefined)
      expect(createReadStream).toHaveBeenCalledWith('/uploads/quizzes/pic.png')
      expect(result).toBeInstanceOf(StreamableFile)
    })

    it('gets the user from the cookie and passes it to the access check', async () => {
      verifyAccessToken.mockResolvedValue(USER_ID)

      await service.getFile(BucketName.Quizzes, 'pic.png', 'quiziset-user-token=a-token')

      expect(verifyAccessToken).toHaveBeenCalledWith(jwtService, prisma, 'a-token')
      expect(canViewQuizUpload).toHaveBeenCalledWith(prisma, 'pic.png', USER_ID)
    })

    it('throws when access to a quizzes image is denied', async () => {
      canViewQuizUpload.mockResolvedValue(false)

      await expect(service.getFile(BucketName.Quizzes, 'pic.png', undefined)).rejects.toThrow(ForbiddenException)
      expect(getUploadedFilePath).not.toHaveBeenCalled()
    })

    it('serves a profiles image without an access check (avatars are public)', async () => {
      const result = await service.getFile(BucketName.Profiles, 'avatar.png', undefined)

      expect(canViewQuizUpload).not.toHaveBeenCalled()
      expect(result).toBeInstanceOf(StreamableFile)
    })
  })

  describe('deleteFile', () => {
    it('deletes the file and its row when the owner removes their unsaved upload', async () => {
      prisma.quizUpload.findUnique.mockResolvedValue({ id: 7, ownerId: USER_ID, quizId: null })

      await service.deleteFile(BucketName.Quizzes, 'pic.png', USER_ID)

      expect(deleteUploadedFile).toHaveBeenCalledWith('quizzes', 'pic.png')
      expect(prisma.quizUpload.delete).toHaveBeenCalledWith({ where: { id: 7 } })
    })

    it('throws when deleting an upload owned by someone else', async () => {
      prisma.quizUpload.findUnique.mockResolvedValue({ id: 7, ownerId: USER_ID + 1, quizId: null })

      await expect(service.deleteFile(BucketName.Quizzes, 'pic.png', USER_ID)).rejects.toThrow(ForbiddenException)
      expect(deleteUploadedFile).not.toHaveBeenCalled()
    })

    it('throws when deleting an upload already attached to a saved quiz', async () => {
      prisma.quizUpload.findUnique.mockResolvedValue({ id: 7, ownerId: USER_ID, quizId: 123 })

      await expect(service.deleteFile(BucketName.Quizzes, 'pic.png', USER_ID)).rejects.toThrow(ForbiddenException)
      expect(deleteUploadedFile).not.toHaveBeenCalled()
    })

    it('avoids deleting a quizzes file with no upload row', async () => {
      prisma.quizUpload.findUnique.mockResolvedValue(null)

      await service.deleteFile(BucketName.Quizzes, 'pic.png', USER_ID)

      expect(deleteUploadedFile).not.toHaveBeenCalled()
    })

    it('deletes a profiles file directly', async () => {
      await service.deleteFile(BucketName.Profiles, 'avatar.png', USER_ID)

      expect(deleteUploadedFile).toHaveBeenCalledWith('profiles', 'avatar.png')
    })
  })
})
