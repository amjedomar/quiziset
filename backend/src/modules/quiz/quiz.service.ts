import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateQuizDto } from '@/modules/quiz/dto/create-quiz.dto'
import { UpdateQuizDto } from '@/modules/quiz/dto/update-quiz.dto'
import { GetAllQuizzesQueryDto } from '@/modules/quiz/dto/get-all-quizzes-query.dto'
import { GetSingleQuizQueryDto, QuizFields } from '@/modules/quiz/dto/get-single-quiz-query.dto'
import { QuizEntity } from '@/modules/quiz/entities/quiz.entity'
import { PaginatedQuizzesEntity } from '@/modules/quiz/entities/paginated-quizzes.entity'
import { QuizSessionService } from '@/modules/quiz-session/quiz-session.service'
import { QuizErrors } from '@/modules/quiz/quiz.errors'
import { omitUndefinedAttrs } from '@/utils/omit-undefined-attrs'
import { deleteAllQuizImageFiles, deleteReplacedQuizImageFiles } from '@/utils/uploads-management'
import { findAccessibleQuizOrThrow } from '@/utils/quiz/quiz-access'
import { buildQuizListQuery, QUIZZES_PAGE_SIZE } from '@/utils/quiz/build-quiz-list-query'
import { Prisma } from '@/generated/prisma/client'
import { PUBLIC_USER_INCLUDE } from '@/modules/user/entities/public-user.entity'

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private sessionService: QuizSessionService,
  ) {}

  async getAll(query: GetAllQuizzesQueryDto, userId?: number): Promise<PaginatedQuizzesEntity> {
    // first finalize all expired sessions so "totalFinishes" is up to date
    await this.sessionService.finalizeAllExpiredSessions()

    const omit = {
      questions: true as const, // questions are always omitted when querying list of quizzes
    }

    const baseWhere = this.buildBaseWhere(query, userId)
    const { searchWhere, orderBy, skip, take } = buildQuizListQuery(query)
    const where: Prisma.QuizWhereInput = { ...baseWhere, ...searchWhere }

    const [quizzes, totalMatches] = await this.prisma.$transaction([
      this.prisma.quiz.findMany({
        where,
        orderBy,
        skip,
        take,
        omit,
        include: {
          manager: { select: PUBLIC_USER_INCLUDE },
        },
      }),
      this.prisma.quiz.count({ where }),
    ])

    const data = await this.attachIsFavoriteToQuizzesArray(quizzes, userId)

    const page = query.page ?? 1
    const totalPages = Math.ceil(totalMatches / QUIZZES_PAGE_SIZE)

    return {
      data,
      page,
      pageSize: QUIZZES_PAGE_SIZE,
      totalMatches,
      totalPages,
    }
  }

  async get(id: number, query: GetSingleQuizQueryDto, userId?: number): Promise<QuizEntity> {
    /**
     * first finalize all expired sessions so
     *  - totalFinishes
     *  - wasTakenByCurrentUserAtLeastOnce
     *  - doesCurrentUserHaveActiveSession
     * have values that are up to date
     */
    await this.sessionService.finalizeAllExpiredSessions()

    const quiz = await findAccessibleQuizOrThrow(this.prisma, id, userId)
    const { questions, ...quizBase } = quiz

    const result: QuizEntity = quizBase

    if (query.fields === QuizFields.DETAILS && userId === quiz.managerId) {
      result.questions = questions
    }

    if (query.fields === QuizFields.OVERVIEW) {
      if (userId) {
        const sessionBaseFilter = {
          quizId: id,
          userId,
        }

        const sessionSelect = {
          // just select a single field because only thing that matter
          // is whether the target session row exists or not
          id: true,
        }

        result.wasTakenByCurrentUserAtLeastOnce = !!(await this.prisma.quizSession.findFirst({
          where: { ...sessionBaseFilter, finishTime: { not: null } },
          select: sessionSelect,
        }))

        result.doesCurrentUserHaveActiveSession = !!(await this.prisma.quizSession.findFirst({
          where: { ...sessionBaseFilter, finishTime: null },
          select: sessionSelect,
        }))
      } else {
        result.wasTakenByCurrentUserAtLeastOnce = false
        result.doesCurrentUserHaveActiveSession = false
      }
    }

    result.isFavorite = await this.isFavoriteSingle(id, userId)

    return result
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

    /**
     * if DTO contains `totalFinishes` request will be automatically rejected
     * (since in app.useGlobalPipes ValidationPipe we forbidNonWhitelisted)
     *
     * but here we are just being extra careful (just so if in future
     * the global ValidationPipe config was changed accidentally) then
     * we already made sure that "totalFinishes" are removed
     * and can't be manipulated
     */
    if ('totalFinishes' in dto) {
      delete dto.totalFinishes
    }

    const result = await this.prisma.quiz.update({
      where: {
        id,
      },
      data: omitUndefinedAttrs(dto),
    })

    // delete old images files that have been replaced
    await deleteReplacedQuizImageFiles(quiz, dto)

    return result
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

    // delete the quiz images files
    await deleteAllQuizImageFiles(quiz)
  }

  // --- helper methods ---

  /**
   * builds the base "where" that determines which quizzes should be listed
   *
   * (please keep in mind that the search filter is added by "buildQuizListQuery" instead
   * and not here)
   *
   * this only build the basic where only
   */
  private buildBaseWhere(query: GetAllQuizzesQueryDto, userId?: number): Prisma.QuizWhereInput {
    const filters: Prisma.QuizWhereInput[] = []

    if (query.favoritedByMe) {
      if (!userId) {
        throw new UnauthorizedException('since favoritedByMe query is true -> "authorization" header must be provided')
      }
      filters.push({ favorites: { some: { userId } } })
    }

    if (query.managedByMe) {
      if (!userId) {
        throw new UnauthorizedException('since managedByMe query is true -> "authorization" header must be provided')
      }
      filters.push({ managerId: userId })
    }

    if (filters.length > 0) {
      return { AND: filters }
    }

    return { isPublic: true }
  }

  /**
   * sets "isFavorite" on each quiz (whether the current user has marked it as favorite)
   * for anonymous users it is always false
   *
   * note: adding/removing favorites logic is coded in the separate "quiz-favorite" module
   * but reading the favorite data is part of the quiz responses so it is coded here
   */
  private async attachIsFavoriteToQuizzesArray(quizzes: QuizEntity[], userId?: number): Promise<QuizEntity[]> {
    if (!userId || quizzes.length === 0) {
      return quizzes.map((quiz) => ({ ...quiz, isFavorite: false }))
    }

    const favorites = await this.prisma.favorite.findMany({
      where: { userId, quizId: { in: quizzes.map((quiz) => quiz.id) } },
      select: { quizId: true },
    })

    const favoritedQuizIds = new Set(favorites.map((favorite) => favorite.quizId))

    return quizzes.map((quiz) => ({ ...quiz, isFavorite: favoritedQuizIds.has(quiz.id) }))
  }

  /**
   * whether the current user has marked the given quiz as favorite (false for anonymous users)
   */
  private async isFavoriteSingle(quizId: number, userId?: number): Promise<boolean> {
    if (!userId) {
      return false
    }

    return !!(await this.prisma.favorite.findUnique({
      where: { quizId_userId: { quizId, userId } },
      select: { quizId: true },
    }))
  }
}
