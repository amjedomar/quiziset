import { Injectable, NotFoundException, StreamableFile, UnprocessableEntityException } from '@nestjs/common'
import { createReadStream } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { extname, join } from 'path'
import { randomUUID } from 'crypto'
import { BucketName } from '@/modules/uploads/dto/upload-params.dto'
import { checkFileExists } from '@/utils/check-file-exists.util'
import { deleteUploadedFile } from '@/utils/uploads/uploaded-image-files.util'
import { UploadResponse } from '@/modules/uploads/entities/upload-response.entity'

const UPLOADS_DIR = join(process.cwd(), 'uploads')

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

    const bucketDir = join(UPLOADS_DIR, bucketName)

    // First, check if the bucket directory exists (if not then create it)
    if (!(await checkFileExists(bucketDir))) {
      await mkdir(bucketDir)
    }

    const fileName = `${randomUUID()}${ext}`
    const filePath = join(bucketDir, fileName)
    await writeFile(filePath, file.buffer)

    return { url: `/uploads/${bucketName}/${fileName}` }
  }

  async getFile(bucketName: BucketName, fileName: string): Promise<StreamableFile> {
    const filePath = join(UPLOADS_DIR, bucketName, fileName)

    if (!(await checkFileExists(filePath))) {
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
