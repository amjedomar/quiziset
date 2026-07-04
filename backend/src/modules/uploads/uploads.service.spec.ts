import { StreamableFile } from '@nestjs/common'
import { createReadStream } from 'fs'
import { UploadsService } from '@/modules/uploads/uploads.service'
import { BucketName } from '@/modules/uploads/dto/upload-params.dto'

// the filesystem and helpers are mocked so nothing is actually read or written to disk
jest.mock('fs', () => ({
  createReadStream: jest.fn(() => ({ pipe: jest.fn() })),
}))

const createUploadedFile = jest.fn()
const getUploadedFilePath = jest.fn()
const deleteUploadedFile = jest.fn()
jest.mock('@/utils/uploads-management', () => ({
  createUploadedFile: (...args: unknown[]) => createUploadedFile(...args),
  getUploadedFilePath: (...args: unknown[]) => getUploadedFilePath(...args),
  deleteUploadedFile: (...args: unknown[]) => deleteUploadedFile(...args),
}))

describe('UploadsService', () => {
  let service: UploadsService

  beforeEach(() => {
    jest.clearAllMocks()
    getUploadedFilePath.mockResolvedValue('/uploads/quizzes/pic.png')
    service = new UploadsService()
  })

  it('saves an uploaded image and returns its url', async () => {
    createUploadedFile.mockResolvedValue('generated-name.png')
    const file = { originalname: 'pic.png', buffer: Buffer.from('image-data') }

    const result = await service.upload(BucketName.Quizzes, file as any)

    expect(createUploadedFile).toHaveBeenCalledWith('quizzes', file.buffer, '.png')
    expect(result.url).toBe('/uploads/quizzes/generated-name.png')
  })

  it('returns an existing file as a stream', async () => {
    const result = await service.getFile(BucketName.Quizzes, 'pic.png')

    expect(createReadStream).toHaveBeenCalledWith('/uploads/quizzes/pic.png')
    expect(result).toBeInstanceOf(StreamableFile)
  })

  it('deletes an uploaded file', async () => {
    await service.deleteFile(BucketName.Quizzes, 'pic.png')

    expect(deleteUploadedFile).toHaveBeenCalledWith('quizzes', 'pic.png')
  })
})
