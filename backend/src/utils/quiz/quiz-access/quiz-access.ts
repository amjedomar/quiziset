import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { QuizErrors } from '@/modules/quiz/quiz.errors'
import { PUBLIC_USER_INCLUDE } from '@/modules/user/entities/public-user.entity'

/**
 * finds the quiz by id and ensures the current user is allowed to view it
 *  - throws 404 if the quiz doesn't exist
 *  - throws 403 if the quiz is private and not owned by the current user
 *
 * it is a shared helper (used by quiz/session/favorite services)
 */
export async function findAccessibleQuizOrThrow(prisma: PrismaService, id: number, userId: number | undefined) {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      manager: { select: PUBLIC_USER_INCLUDE },
    },
  })

  if (!quiz) {
    throw new NotFoundException(QuizErrors.NOT_FOUND)
  }

  if (!quiz.isPublic && quiz.managerId !== userId) {
    throw new ForbiddenException(QuizErrors.VIEW_FORBIDDEN)
  }

  return quiz
}
