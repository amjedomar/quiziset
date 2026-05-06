import { Injectable } from '@nestjs/common'
import { PrismaClient } from './generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import process from 'node:process'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const {
      DB_HOST,
      DB_PORT,
      DB_USER,
      DB_PASSWORD,
      DB_NAME,
    } = process.env;

    const adapter = new PrismaMariaDb({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    })

    super({ adapter })
  }
}
