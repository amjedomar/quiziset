import { StreamableFile } from '@nestjs/common'
import { writeFile } from 'fs/promises'
import { createReadStream } from 'fs'
import { UploadsService } from '@/modules/uploads/uploads.service'
import { BucketName } from '@/modules/uploads/dto/upload-params.dto'
import { checkFileExists } from '@/utils/check-file-exists.util'
import { deleteUploadedFile } from '@/utils/uploads/uploaded-image-files.util'

// the filesystem and helpers are mocked so nothing is actually read or written to disk
jest.mock('fs/promises')
jest.mock('fs', () => ({
  createReadStream: jest.fn(() => ({ pipe: jest.fn() })),
}))
jest.mock('@/utils/check-file-exists.util', () => ({
  checkFileExists: jest.fn().mockResolvedValue(true),
}))
jest.mock('@/utils/uploads/uploaded-image-files.util', () => ({
  deleteUploadedFile: jest.fn().mockResolvedValue(undefined),
}))

describe('UploadsService', () => {
  let service: UploadsService

  beforeEach(() => {
    jest.clearAllMocks()
    ;(checkFileExists as jest.Mock).mockResolvedValue(true)
    service = new UploadsService()
  })

  it('saves an uploaded image and returns its url', async () => {
    const file = { originalname: 'pic.png', buffer: Buffer.from('image-data') }

    const result = await service.upload(BucketName.Quizzes, file as any)

    expect(writeFile).toHaveBeenCalled()
    expect(result.url).toMatch(/^\/uploads\/quizzes\/[\w-]+\.png$/)
  })

  it('returns an existing file as a stream', async () => {
    const result = await service.getFile(BucketName.Quizzes, 'pic.png')

    expect(createReadStream).toHaveBeenCalled()
    expect(result).toBeInstanceOf(StreamableFile)
  })

  it('deletes an uploaded file', async () => {
    await service.deleteFile(BucketName.Quizzes, 'pic.png')

    expect(deleteUploadedFile).toHaveBeenCalledWith('quizzes', 'pic.png')
  })
})
