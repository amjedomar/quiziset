import { Module } from '@nestjs/common'
import { AuthModule } from '@/modules/auth/auth.module'
import { UploadsModule } from '@/modules/uploads/uploads.module'
import { AppController } from '@/app.controller'

@Module({
  imports: [AuthModule, UploadsModule],
  controllers: [AppController],
})
export class AppModule {}
