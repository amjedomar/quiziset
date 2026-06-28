import argon2 from 'argon2'
import type { PrismaClient } from '@/generated/prisma/client'
import { TEST_USER_PASSWORD, TEST_USERS } from './config'
import { getSampleAvatarPath } from '@/utils/sample-images.util'

export async function seedUsers(prisma: PrismaClient) {
  // every test user has the same password so hash it once and use it for all test users
  const passwordHash = await argon2.hash(TEST_USER_PASSWORD)

  const users = []

  for (const user of TEST_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } })

    if (existing) {
      console.log(`  • user ${user.email} already exists -> skipped`)
      users.push(existing)
    } else {
      const created = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: passwordHash,
          imageUrl: user.avatar ? getSampleAvatarPath(user.avatar) : null,
        },
      })

      console.log(`  • created user ${user.email}`)
      users.push(created)
    }
  }

  return users
}
