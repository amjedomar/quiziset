import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { GetUploadParamsDto, UploadParamsDto } from '@/modules/uploads/dto/upload-params.dto'
import { UploadBodyDto } from '@/modules/uploads/dto/upload-body.dto'
import { UploadsService } from '@/modules/uploads/uploads.service'
import { UploadResponse } from '@/modules/uploads/entities/upload-response.entity'
import { IsPublic } from '@/decorators/is-public.decorator'
import { ApiResponsesList } from '@/decorators/api-responses-list'

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /**
   * Upload file endpoint
   */
  @Post('/:bucketName')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'upload a file' })
  @ApiConsumes('multipart/form-data') // this will render input file upload in Swagger Docs
  @ApiBody({ type: UploadBodyDto }) // define ApiBody explicity (since we use @UploadedFile instead of @Body)
  @ApiResponsesList({ status: 201, type: UploadResponse }, { status: 422, description: 'invalid file extension' })
  async upload(
    @Param() { bucketName }: UploadParamsDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponse> {
    return this.uploadsService.upload(bucketName, file)
  }

  /**
   * Get file endpoint
   */
  @Get('/:bucketName/:fileName')
  @IsPublic()
  @ApiOperation({ summary: 'returns file (e.g. image)' })
  @ApiResponsesList({
    status: 200,
    description: 'file stream', // file streams are memory-friendly as explained in "uploads.service.ts"
  })
  @ApiResponse({ status: 404, description: 'file not found' })
  getFile(@Param() { bucketName, fileName }: GetUploadParamsDto) {
    return this.uploadsService.getFile(bucketName, fileName)
  }
}
