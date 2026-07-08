import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
  UnprocessableEntityException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { createReadStream } from 'fs'
import { extname } from 'path'
import { PrismaService } from '@/prisma-service'
import { BucketName } from '@/modules/uploads/dto/upload-params.dto'
import { createUploadedFile, deleteUploadedFile, getUploadedFilePath } from '@/utils/uploads-management/uploads-fs'
import { canViewQuizUpload, USER_TOKEN_COOKIE } from '@/utils/uploads-management/uploads-access'
import { UploadResponse } from '@/modules/uploads/entities/upload-response.entity'
import { verifyAccessToken } from '@/utils/auth-token'
import { parseCookie } from 'cookie'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
}

const ALLOWED_EXTENSIONS = Object.keys(MIME_TYPES)

const UploadsErrors = {
  INVALID_EXTENSION: 'invalid extension: only .jpg, .jpeg and .png are allowed',
  NOT_FOUND: 'file not found',
  VIEW_FORBIDDEN: 'you are not allowed to view this image',
  DELETE_FORBIDDEN: 'you can only delete your own not-yet-saved uploads',
}

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async upload(bucketName: BucketName, file: Express.Multer.File, ownerId: number): Promise<UploadResponse> {
    const ext = extname(file.originalname).toLowerCase()

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new UnprocessableEntityException(UploadsErrors.INVALID_EXTENSION)
    }

    const fileName = await createUploadedFile(bucketName, file.buffer, ext)

    /**
     * for images of quizzes we should track who uploaded it
     * so then in "getFile" images of PRIVATE quizzes are protected
     *
     * btw "attachQuizUploadsOrThrow" in quiz.service.ts (links them
     * to the quiz during create/update operation of quizzes)
     */
    if (bucketName === BucketName.Quizzes) {
      await this.prisma.quizUpload.create({
        data: { bucket: bucketName, fileName, ownerId },
      })
    }

    return { url: `/uploads/${bucketName}/${fileName}` }
  }

  async getFile(bucketName: BucketName, fileName: string, cookieHeader: string | undefined): Promise<StreamableFile> {
    // "profiles" avatars are always public so only "quizzes" images are checked for access
    if (bucketName === BucketName.Quizzes) {
      const userId = await this.getUserIdFromCookie(cookieHeader)

      if (!(await canViewQuizUpload(this.prisma, fileName, userId))) {
        throw new ForbiddenException(UploadsErrors.VIEW_FORBIDDEN)
      }
    }

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

  async deleteFile(bucketName: BucketName, fileName: string, userId: number): Promise<void> {
    // "quizzes" can only be deleted by the quiz owner (and only while unsaved)
    // for removed images from existing quiz they are handled in quiz update endpoint instead
    if (bucketName === BucketName.Quizzes) {
      const quizUpload = await this.prisma.quizUpload.findUnique({
        where: { bucket_fileName: { bucket: bucketName, fileName } },
      })

      if (!quizUpload) {
        return
      }

      // again we check for "quizUpload.quizId !== null" because images
      // of existing quizzes removal is handled in quiz update endpoint instead :)
      if (quizUpload.ownerId !== userId || quizUpload.quizId !== null) {
        throw new ForbiddenException(UploadsErrors.DELETE_FORBIDDEN)
      }

      await deleteUploadedFile(bucketName, fileName)
      await this.prisma.quizUpload.delete({ where: { id: quizUpload.id } })

      return
    }

    await deleteUploadedFile(bucketName, fileName)
  }

  /**
   * reads and verifies the auth token from the request cookie
   *
   * image <img> requests can't send the "Authorization" header
   * so the token is read from the cookie here
   *
   * IMPORTANT!!!: NEVER use this for requests that does modification on data (e.g. POST/PATCH/DELETE)
   * because it will be vulnerable to CSRF attacks (To prevent such vulnerability the solution
   * is to extract token from "Authorization" header which "@AuthUser" decorator already does it)
   * see https://security.stackexchange.com/questions/170388/do-i-need-csrf-token-if-im-using-bearer-jwt
   *
   * but for this endpoint it is READ-ONLY so it is ok to use it :)
   */
  private async getUserIdFromCookie(cookieHeader: string | undefined): Promise<number | undefined> {
    const token = parseCookie(cookieHeader ?? '')[USER_TOKEN_COOKIE]

    if (!token) {
      return undefined
    }

    // "verifyAccessToken" verifies the token (but keep in mind that it
    // rejects it if the token was issued before the user's last password change)
    const userId = await verifyAccessToken(this.jwtService, this.prisma, token)

    return userId ?? undefined
  }
}
