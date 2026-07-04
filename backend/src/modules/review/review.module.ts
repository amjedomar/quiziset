import { Module } from '@nestjs/common'
import { ReviewController } from '@/modules/review/review.controller'
import { ReviewService } from '@/modules/review/review.service'
import { PrismaService } from '@/prisma-service'

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService],
})
export class ReviewModule {}
