import 'reflect-metadata'
import 'dotenv/config'
import { createPrismaClient } from '@/utils/prisma-adapter.util'
import { toTitleCase } from '@/utils/string.util'
import { QUIZZES_LIST } from './config'
import { seedUsers } from './users'
import { seedQuiz } from './quizzes'
import { seedFavorites } from './favorites'

async function main() {
  const prisma = createPrismaClient()

  try {
    console.log('seeding users...')
    const users = await seedUsers(prisma)

    /**
     * to keep things simple in this seeding
     * the manager of all quizzes is the first user (amjed) i.e. me haha :)
     */
    const manager = users[0]

    // I skip the content seeding when the test manager (amjed) already owns quizzes so the seed
    // is safe to run again without resulting in duplicated quizzes/sessions/reviews
    const existingQuizCount = await prisma.quiz.count({ where: { managerId: manager.id } })

    if (existingQuizCount > 0) {
      console.log(
        `\nuser (amjed) already owns ${existingQuizCount} quizzes -> skipping seeding \n\n` +
          '!!! Otherwise, you can run `npx prisma migrate reset --force` to clear up the database then re-run the seed command :)',
      )
      return
    }

    console.log(`seeding ${QUIZZES_LIST.length} quizzes (with their sessions and reviews)...`)
    const quizIds: number[] = []
    let totalSessions = 0
    let totalReviews = 0

    for (let index = 0; index < QUIZZES_LIST.length; index++) {
      const result = await seedQuiz(prisma, users, manager.id, index)
      quizIds.push(result.quizId)
      totalSessions += result.sessionsCount
      totalReviews += result.reviewsCount
      console.log(
        `  • ${toTitleCase(QUIZZES_LIST[index])} (${result.sessionsCount} sessions, ${result.reviewsCount} reviews)`,
      )
    }

    console.log('seeding favorites...')
    const favoritesCount = await seedFavorites(prisma, users, quizIds)

    console.log('\nseed finished successfully')
    console.log(`  users:     ${users.length}`)
    console.log(`  quizzes:   ${quizIds.length}`)
    console.log(`  sessions:  ${totalSessions}`)
    console.log(`  reviews:   ${totalReviews}`)
    console.log(`  favorites: ${favoritesCount}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('seed failed:', error)
  process.exit(1)
})
