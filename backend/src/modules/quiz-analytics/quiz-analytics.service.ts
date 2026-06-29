import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { QuizSessionService } from '@/modules/quiz-session/quiz-session.service'
import { PaginatedQuizAnalyticsEntity } from '@/modules/quiz-analytics/entities/paginated-quiz-analytics.entity'
import {
  GetQuizAnalyticsQueryDto,
  DEFAULT_ANALYTICS_PAGE_SIZE,
} from '@/modules/quiz-analytics/dto/get-quiz-analytics-query.dto'
import { QuizErrors, QuizAnalyticsErrors } from '@/modules/quiz/quiz.errors'
import { PUBLIC_USER_INCLUDE } from '@/modules/user/entities/public-user.entity'

@Injectable()
export class QuizAnalyticsService {
  constructor(
    private prisma: PrismaService,
    private sessionService: QuizSessionService,
  ) {}

  async getAnalytics(
    quizId: number,
    userId: number,
    query: GetQuizAnalyticsQueryDto,
  ): Promise<PaginatedQuizAnalyticsEntity> {
    // finalize expired sessions first so finishTime (ongoing vs finished) is up to date
    await this.sessionService.finalizeAllExpiredSessions()

    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } })

    if (!quiz) {
      throw new NotFoundException(QuizErrors.NOT_FOUND)
    }

    if (quiz.managerId !== userId) {
      throw new ForbiddenException(QuizErrors.FORBIDDEN)
    }

    if (!quiz.isAnalyticsEnabled) {
      throw new BadRequestException(QuizAnalyticsErrors.ANALYTICS_DISABLED)
    }

    const page = query.page ?? 1
    const pageSize = query.pageSize ?? DEFAULT_ANALYTICS_PAGE_SIZE
    const where = { quizId, isAnalyticsShared: true }

    const [sessions, totalMatches] = await this.prisma.$transaction([
      this.prisma.quizSession.findMany({
        where,
        orderBy: { startTime: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: PUBLIC_USER_INCLUDE } },
      }),
      this.prisma.quizSession.count({ where }),
    ])

    const totalPages = Math.ceil(totalMatches / pageSize)

    return {
      data: sessions.map((session) => ({
        id: session.id,
        user: session.user,
        questionsCount: session.questionsCount,
        successfulAnswersCount: session.successfulAnswersCount,
        startTime: session.startTime,
        finishTime: session.finishTime,
      })),
      page,
      pageSize,
      totalMatches,
      totalPages,
    }
  }
}
