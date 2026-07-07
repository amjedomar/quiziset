import { PrismaService } from '@/prisma-service'

/**
 * the name of the auth token cookie
 *
 * it must match the cookie the frontend sets (see the frontend USER_TOKEN_COOKIE)
 * because image <img> requests can only send a cookie (not the Authorization header)
 */
export const USER_TOKEN_COOKIE = 'quiziset-user-token'

// only the "quizzes" bucket is access protected (avatars in "profiles" are public)
const QUIZZES_BUCKET = 'quizzes'

/**
 * decides whether a user can view a "quizzes" bucket file
 *
 *  - the uploader can always view their own file (saved or not, public or private)
 *  - otherwise the file is only viewable when it belongs to a public quiz
 *  - an untracked file (i.e. when there isn't an upload row in DB) it is never viewable
 */
export async function canViewQuizUpload(
  prisma: PrismaService,
  fileName: string,
  userId: number | undefined,
): Promise<boolean> {
  const quizUpload = await prisma.quizUpload.findUnique({
    where: { bucket_fileName: { bucket: QUIZZES_BUCKET, fileName } },
    include: { quiz: { select: { isPublic: true } } },
  })

  if (!quizUpload) {
    return false
  }

  if (userId !== undefined && quizUpload.ownerId === userId) {
    return true
  }

  return quizUpload.quiz?.isPublic === true
}
