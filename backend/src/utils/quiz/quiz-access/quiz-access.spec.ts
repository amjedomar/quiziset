import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { makeQuizRecord, USER_ID } from '@/test-utils/mocks'
import { findAccessibleQuizOrThrow } from './quiz-access'

describe('findAccessibleQuizOrThrow', () => {
  let prisma: any

  beforeEach(() => {
    prisma = { quiz: { findUnique: jest.fn() } }
  })

  it('returns the quiz when it is public', async () => {
    const quiz = makeQuizRecord({ isPublic: true })

    prisma.quiz.findUnique.mockResolvedValue(quiz)

    expect(await findAccessibleQuizOrThrow(prisma, quiz.id, undefined)).toBe(quiz)
  })

  it('returns the quiz when it is private but owned by the current user', async () => {
    const quiz = makeQuizRecord({ isPublic: false, managerId: USER_ID })

    prisma.quiz.findUnique.mockResolvedValue(quiz)

    expect(await findAccessibleQuizOrThrow(prisma, quiz.id, USER_ID)).toBe(quiz)
  })

  it('throws NotFoundException when the quiz does not exist', async () => {
    prisma.quiz.findUnique.mockResolvedValue(null)

    await expect(findAccessibleQuizOrThrow(prisma, 999, USER_ID)).rejects.toThrow(NotFoundException)
  })

  it('throws ForbiddenException when the quiz is private and not owned by the current user', async () => {
    const quiz = makeQuizRecord({ isPublic: false, managerId: USER_ID })

    prisma.quiz.findUnique.mockResolvedValue(quiz)

    await expect(findAccessibleQuizOrThrow(prisma, quiz.id, USER_ID + 1)).rejects.toThrow(ForbiddenException)
  })
})
