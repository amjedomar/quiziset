import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateQuizDto } from '@/modules/quiz/dto/create-quiz.dto'
import { UpdateQuizDto } from '@/modules/quiz/dto/update-quiz.dto'
import { GetAllQuizzesQueryDto } from '@/modules/quiz/dto/get-all-quizzes-query.dto'
import { QuizEntity } from '@/modules/quiz/entities/quiz.entity'
import { omitUndefinedAttrs } from '@/utils/omit-undefined-attrs'

const QuizErrors = {
  NOT_FOUND: 'quiz not found',
  FORBIDDEN: 'you are not the manager of this quiz',
  VIEW_FORBIDDEN: 'this quiz is private',
}

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async getAll(query: GetAllQuizzesQueryDto, userId?: number): Promise<QuizEntity[]> {
    if (query.managedByMe) {
      if (!userId) {
        throw new UnauthorizedException('since managedByMe query is true -> "authorization" header must be provided')
      }

      return this.prisma.quiz.findMany({ where: { managerId: userId } })
    }

    return this.prisma.quiz.findMany({ where: { isPublic: true } })
  }

  async get(id: number, userId?: number): Promise<QuizEntity> {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } })

    if (!quiz) {
      throw new NotFoundException(QuizErrors.NOT_FOUND)
    }

    if (!quiz.isPublic && quiz.managerId !== userId) {
      throw new ForbiddenException(QuizErrors.VIEW_FORBIDDEN)
    }

    return quiz
  }

  async create(dto: CreateQuizDto, managerId: number): Promise<QuizEntity> {
    return this.prisma.quiz.create({
      data: {
        ...dto,
        managerId,
      },
    })
  }

  async update(id: number, dto: UpdateQuizDto, userId: number): Promise<QuizEntity> {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } })

    if (!quiz) {
      throw new NotFoundException(QuizErrors.NOT_FOUND)
    }

    if (quiz.managerId !== userId) {
      throw new ForbiddenException(QuizErrors.FORBIDDEN)
    }

    return this.prisma.quiz.update({
      where: {
        id,
      },
      data: omitUndefinedAttrs(dto),
    })
  }

  async delete(id: number, userId: number): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } })

    if (!quiz) {
      throw new NotFoundException(QuizErrors.NOT_FOUND)
    }

    if (quiz.managerId !== userId) {
      throw new ForbiddenException(QuizErrors.FORBIDDEN)
    }

    await this.prisma.quiz.delete({ where: { id } })
  }
}
