import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import process from 'node:process'

/**
 * Check docs https://www.prisma.io/docs/orm/reference/error-reference
 */
export enum PrismaErrorCode {
  UniqueConstraintViolation = 'P2002',
}

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

    const adapter = new PrismaMariaDb({
      connectionLimit: 10,
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      // below option is needed to fix "pool timeout" – "RSA public key is not available client side" errors
      allowPublicKeyRetrieval: true,
    })

    super({ adapter })
  }
}
