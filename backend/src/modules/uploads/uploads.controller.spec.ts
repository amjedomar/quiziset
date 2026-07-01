import { UploadsController } from '@/modules/uploads/uploads.controller'
import { BucketName } from '@/modules/uploads/dto/upload-params.dto'

// the service is mocked so we only test that the controller delegates correctly
describe('UploadsController', () => {
  let uploadsService: any
  let controller: UploadsController

  beforeEach(() => {
    uploadsService = { upload: jest.fn(), getFile: jest.fn(), deleteFile: jest.fn() }
    controller = new UploadsController(uploadsService)
  })

  it('delegates uploading a file to the service and returns its result', async () => {
    const file = { originalname: 'pic.png', buffer: Buffer.from('data') }
    const response = { url: '/uploads/quizzes/pic.png' }

    uploadsService.upload.mockResolvedValue(response)

    const result = await controller.upload({ bucketName: BucketName.Quizzes }, file as any)

    expect(uploadsService.upload).toHaveBeenCalledWith(BucketName.Quizzes, file)
    expect(result).toBe(response)
  })

  it('delegates getting a file to the service and returns its result', () => {
    const stream = { stream: true }

    uploadsService.getFile.mockReturnValue(stream)

    const result = controller.getFile({ bucketName: BucketName.Quizzes, fileName: 'pic.png' })

    expect(uploadsService.getFile).toHaveBeenCalledWith(BucketName.Quizzes, 'pic.png')
    expect(result).toBe(stream)
  })

  it('delegates deleting a file to the service', async () => {
    uploadsService.deleteFile.mockResolvedValue(undefined)

    await controller.deleteFile({ bucketName: BucketName.Quizzes, fileName: 'pic.png' })

    expect(uploadsService.deleteFile).toHaveBeenCalledWith(BucketName.Quizzes, 'pic.png')
  })
})
