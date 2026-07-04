import { Module } from '@nestjs/common'
import { UserController } from '@/modules/user/user.controller'
import { UserService } from '@/modules/user/user.service'
import { PrismaService } from '@/prisma-service'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
