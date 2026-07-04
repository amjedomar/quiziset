import { Injectable, NotFoundException, StreamableFile, UnprocessableEntityException } from '@nestjs/common'
import { createReadStream } from 'fs'
import { extname } from 'path'
import { BucketName } from '@/modules/uploads/dto/upload-params.dto'
import { createUploadedFile, deleteUploadedFile, getUploadedFilePath } from '@/utils/uploads-management'
import { UploadResponse } from '@/modules/uploads/entities/upload-response.entity'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
}

const ALLOWED_EXTENSIONS = Object.keys(MIME_TYPES)

const UploadsErrors = {
  INVALID_EXTENSION: 'invalid extension: only .jpg, .jpeg and .png are allowed',
  NOT_FOUND: 'file not found',
}

@Injectable()
export class UploadsService {
  async upload(bucketName: BucketName, file: Express.Multer.File): Promise<UploadResponse> {
    const ext = extname(file.originalname).toLowerCase()

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new UnprocessableEntityException(UploadsErrors.INVALID_EXTENSION)
    }

    const fileName = await createUploadedFile(bucketName, file.buffer, ext)

    return { url: `/uploads/${bucketName}/${fileName}` }
  }

  async getFile(bucketName: BucketName, fileName: string): Promise<StreamableFile> {
    const filePath = await getUploadedFilePath(bucketName, fileName)

    if (!filePath) {
      throw new NotFoundException(UploadsErrors.NOT_FOUND)
    }

    const ext = extname(fileName).toLowerCase()
    const type = MIME_TYPES[ext]

    if (!type) {
      /**
       * if extension isn't one of what has been specified in "MIME_TYPES"
       * Then also return 404 error
       */
      throw new NotFoundException(UploadsErrors.NOT_FOUND)
    }

    /**
     * Returning file as stream is memory-friendly way (instead of loading it all at once into memory)
     */
    return new StreamableFile(createReadStream(filePath), { type })
  }

  async deleteFile(bucketName: BucketName, fileName: string): Promise<void> {
    await deleteUploadedFile(bucketName, fileName)
  }
}
