import { Module } from '@nestjs/common'
import { QuizController } from '@/modules/quiz/quiz.controller'
import { QuizService } from '@/modules/quiz/quiz.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [QuizController],
  providers: [QuizService, PrismaService],
})
export class QuizModule {}
