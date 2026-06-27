import { Module } from '@nestjs/common'
import { QuizFavoriteController } from '@/modules/quiz-favorite/quiz-favorite.controller'
import { QuizFavoriteService } from '@/modules/quiz-favorite/quiz-favorite.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [QuizFavoriteController],
  providers: [QuizFavoriteService, PrismaService],
})
export class QuizFavoriteModule {}
