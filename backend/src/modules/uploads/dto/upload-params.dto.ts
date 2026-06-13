import { IsEnum, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export enum BucketName {
  Quizzes = 'quizzes',
  Profiles = 'profiles',
}

export class UploadParamsDto {
  @IsEnum(BucketName)
  @ApiProperty({ enum: BucketName })
  bucketName: BucketName
}

export class GetUploadParamsDto extends UploadParamsDto {
  @ApiProperty({ description: 'file name within the bucket' })
  @IsString()
  fileName: string
}
