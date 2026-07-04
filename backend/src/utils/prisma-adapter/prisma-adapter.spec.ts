import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@/generated/prisma/client'
import { createPrismaAdapter, createPrismaClient } from './prisma-adapter'

jest.mock('@prisma/adapter-mariadb', () => ({
  PrismaMariaDb: jest.fn(),
}))

jest.mock('@/generated/prisma/client', () => ({
  PrismaClient: jest.fn(),
}))

describe('createPrismaAdapter', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      DB_HOST: 'localhost',
      DB_PORT: '3306',
      DB_USER: 'root',
      DB_PASSWORD: 'secret',
      DB_NAME: 'quiziset',
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('creates a PrismaMariaDb adapter from the DB env vars', () => {
    createPrismaAdapter()

    expect(PrismaMariaDb).toHaveBeenCalledWith({
      connectionLimit: 10,
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'secret',
      database: 'quiziset',
      allowPublicKeyRetrieval: true,
    })
  })
})

describe('createPrismaClient', () => {
  it('creates a PrismaClient using the adapter', () => {
    createPrismaClient()

    expect(PrismaClient).toHaveBeenCalledWith({ adapter: expect.any(PrismaMariaDb) })
  })
})
