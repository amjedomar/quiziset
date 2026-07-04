import { Module } from '@nestjs/common'
import { PrismaService } from '@/prisma-service'
import { AuthService } from '@/modules/auth/auth.service'
import { AuthController } from '@/modules/auth/auth.controller'

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
