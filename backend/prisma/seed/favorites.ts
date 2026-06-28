import type { PrismaClient, User } from '@/generated/prisma/client'
import { FAVORITE_QUIZ_INDEXES } from './config'

export async function seedFavorites(prisma: PrismaClient, users: User[], quizIds: number[]) {
  const favorites = users.flatMap((user, userIndex) =>
    // map the hardcoded quiz indexes to the real quiz ids
    FAVORITE_QUIZ_INDEXES[userIndex].map((quizIndex) => ({ quizId: quizIds[quizIndex], userId: user.id })),
  )

  await prisma.favorite.createMany({ data: favorites, skipDuplicates: true })

  return favorites.length
}
