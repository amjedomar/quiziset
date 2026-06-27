import { Module } from '@nestjs/common'
import { QuizController } from '@/modules/quiz/quiz.controller'
import { QuizService } from '@/modules/quiz/quiz.service'
import { QuizSessionModule } from '@/modules/quiz-session/quiz-session.module'
import { PrismaService } from '@/prisma.service'

@Module({
  imports: [
    QuizSessionModule, // QuizSessionModule is imported so QuizService can finalize expired sessions before reading quizzes
  ],
  controllers: [QuizController],
  providers: [QuizService, PrismaService],
})
export class QuizModule {}
