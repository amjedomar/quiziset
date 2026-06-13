import { Module } from '@nestjs/common'
import { UploadsController } from '@/modules/uploads/uploads.controller'
import { UploadsService } from '@/modules/uploads/uploads.service'

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
