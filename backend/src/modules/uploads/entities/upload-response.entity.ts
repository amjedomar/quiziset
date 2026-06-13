import { ApiProperty } from '@nestjs/swagger'

export class UploadResponse {
  @ApiProperty({ description: 'returns the url of the uploaded file' })
  url: string
}
