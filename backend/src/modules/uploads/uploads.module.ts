import { Module } from '@nestjs/common'
import { UploadsController } from '@/modules/uploads/uploads.controller'
import { UploadsService } from '@/modules/uploads/uploads.service'
import { PrismaService } from '@/prisma-service'

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, PrismaService],
})
export class UploadsModule {}
