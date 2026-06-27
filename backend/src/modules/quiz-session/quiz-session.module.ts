import { Module } from '@nestjs/common'
import { QuizSessionController } from '@/modules/quiz-session/quiz-session.controller'
import { QuizSessionService } from '@/modules/quiz-session/quiz-session.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [QuizSessionController],
  providers: [QuizSessionService, PrismaService],
  exports: [
    QuizSessionService, // exported so QuizService can finalize expired sessions before reading quizzes
  ],
})
export class QuizSessionModule {}
