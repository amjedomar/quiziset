import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma-service'
import { findAccessibleQuizOrThrow } from '@/utils/quiz/quiz-access'

@Injectable()
export class QuizFavoriteService {
  constructor(private prisma: PrismaService) {}

  /**
   * adds the quiz to the current user's favorites (does nothing if already marked as favorite)
   */
  async add(quizId: number, userId: number): Promise<void> {
    // ensure the quiz exists and is viewable (throws 404 / 403 otherwise)
    await findAccessibleQuizOrThrow(this.prisma, quizId, userId)

    await this.prisma.favorite.upsert({
      where: { quizId_userId: { quizId, userId } },
      create: { quizId, userId },
      update: {},
    })
  }

  /**
   * removes the quiz from the current user's favorites (does nothing if it wasn't marked as favorite)
   */
  async remove(quizId: number, userId: number): Promise<void> {
    await this.prisma.favorite.deleteMany({ where: { quizId, userId } })
  }
}
