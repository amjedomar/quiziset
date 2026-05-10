import { Module } from '@nestjs/common'
import { AuthModule } from '@/modules/auth/auth.module'
import { AppController } from '@/app.controller'

@Module({
  imports: [AuthModule],
  controllers: [AppController],
})
export class AppModule {}
