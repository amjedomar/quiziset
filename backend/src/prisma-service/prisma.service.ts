import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@/generated/prisma/client'
import { createPrismaAdapter } from '@/utils/prisma-adapter'

/**
 * Check docs https://www.prisma.io/docs/orm/reference/error-reference
 */
export enum PrismaErrorCode {
  UniqueConstraintViolation = 'P2002',
}

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({ adapter: createPrismaAdapter() })
  }
}
