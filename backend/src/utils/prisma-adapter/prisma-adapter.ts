import { PrismaClient } from '@/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

export function createPrismaAdapter(): PrismaMariaDb {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

  return new PrismaMariaDb({
    connectionLimit: 10,
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    /**
     * below option is needed to fix "pool timeout" – "RSA public key is not available client side" errors
     * see https://stackoverflow.com/a/78143216/8148505
     */
    allowPublicKeyRetrieval: true,
  })
}

/**
 * - only used for seeding scripts
 * - however for Nest.js we must extends 'PrismaClient' and make the
 *   subclass injectable (see prisma.service.ts)
 */
export function createPrismaClient(): PrismaClient {
  return new PrismaClient({ adapter: createPrismaAdapter() })
}
