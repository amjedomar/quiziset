import { Module } from '@nestjs/common'
import { QuizAnalyticsController } from '@/modules/quiz-analytics/quiz-analytics.controller'
import { QuizAnalyticsService } from '@/modules/quiz-analytics/quiz-analytics.service'
import { QuizSessionModule } from '@/modules/quiz-session/quiz-session.module'
import { PrismaService } from '@/prisma-service'

@Module({
  imports: [
    QuizSessionModule, // import QuizSessionModule to finalize expired sessions before reading analytics
  ],
  controllers: [QuizAnalyticsController],
  providers: [QuizAnalyticsService, PrismaService],
})
export class QuizAnalyticsModule {}
