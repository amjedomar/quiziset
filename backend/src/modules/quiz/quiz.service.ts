import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateQuizDto } from '@/modules/quiz/dto/create-quiz.dto'
import { UpdateQuizDto } from '@/modules/quiz/dto/update-quiz.dto'
import { GetAllQuizzesQueryDto } from '@/modules/quiz/dto/get-all-quizzes-query.dto'
import { GetSingleQuizQueryDto, QuizFields } from '@/modules/quiz/dto/get-single-quiz-query.dto'
import { StartQuizSessionDto } from '@/modules/quiz/dto/start-quiz-session.dto'
import { SubmitQuizSessionAnswerDto } from '@/modules/quiz/dto/submit-quiz-session-answer.dto'
import { QuizEntity } from '@/modules/quiz/entities/quiz.entity'
import { QuizSessionStateEntity } from '@/modules/quiz/entities/quiz-session.entity'
import { omitUndefinedAttrs } from '@/utils/omit-undefined-attrs'
import { QuizSession } from '@/generated/prisma/client'
import {
  buildSessionQuestions,
  checkIsAnswerCorrect,
  checkIsSessionExpired,
  buildSessionState,
} from '@/utils/quiz-session'

const QuizErrors = {
  NOT_FOUND: 'quiz not found',
  FORBIDDEN: 'you are not the manager of this quiz',
  VIEW_FORBIDDEN: 'this quiz is private',
}

const QuizSessionErrors = {
  ANALYTICS_SHARE_REQUIRED: 'sharing analytics is required to start a session for this quiz',
  /**
   * error "NO_ACTIVE_SESSION"
   * - is thrown for "submitAnswer" only
   * - however for "startSession" (it creates a new session if there isn't)
   *   it doesn't throw this error
   */
  NO_ACTIVE_SESSION: 'no active quiz session found',
}

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async getAll(query: GetAllQuizzesQueryDto, userId?: number): Promise<QuizEntity[]> {
    const omit = {
      questions: true as const, // questions are always omitted when querying list of quizzes
    }

    if (query.managedByMe) {
      if (!userId) {
        throw new UnauthorizedException('since managedByMe query is true -> "authorization" header must be provided')
      }

      return this.prisma.quiz.findMany({ where: { managerId: userId }, omit })
    }

    return this.prisma.quiz.findMany({ where: { isPublic: true }, omit })
  }

  async get(id: number, query: GetSingleQuizQueryDto, userId?: number): Promise<QuizEntity> {
    const quiz = await this.findQuiz(id, userId)
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

    return result
  }

  private async findQuiz(id: number, userId?: number) {
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

  /**
   * starts a new quiz session OR resumes the user's active session (if there is)
   *
   * when there is no active session and the quiz has analytics enabled the user
   * must explicitly agree to share analytics (via "isAnalyticsShared") otherwise a 400
   * response error is thrown
   */
  async startSession(quizId: number, userId: number, dto: StartQuizSessionDto): Promise<QuizSessionStateEntity> {
    // use "this.findQuiz" method because it already ensures that access it allowed
    // i.e. it throws 404 if quiz doesn't exists OR 403 if the quiz is private and not owned
    const quiz = await this.findQuiz(quizId, userId)

    const activeSession = await this.prisma.quizSession.findFirst({
      where: { quizId, userId, finishTime: null },
    })

    if (activeSession) {
      if (checkIsSessionExpired(activeSession)) {
        // finalize the expired session (but don't return it)
        // instead later below a new session will be created
        await this.finalizeSession(activeSession)
      } else {
        // otherwise resume the existing session
        return buildSessionState(activeSession)
      }
    }

    if (quiz.isAnalyticsEnabled && dto.isAnalyticsShared !== true) {
      throw new BadRequestException(QuizSessionErrors.ANALYTICS_SHARE_REQUIRED)
    }

    const startTime = new Date()
    const expireTime =
      quiz.timeDurationInMinutes !== null
        ? new Date(startTime.getTime() + quiz.timeDurationInMinutes * 60 * 1000)
        : null

    const questions = buildSessionQuestions(quiz.questions)

    const createdSession = await this.prisma.quizSession.create({
      data: {
        quizId,
        userId,
        startTime,
        expireTime,
        questions,
        questionsCount: questions.length,
        isAnalyticsShared: dto.isAnalyticsShared ?? false,
      },
    })

    return buildSessionState(createdSession)
  }

  /**
   * This method grades the user's answer of the current question (only if time isn't up)
   *
   * Then either:
   *   - returns the next question (in case the session is still on-going)
   *   - or the result `successfulAnswersCount` once the quiz is finished
   *    (i.e. the last question was answered or the session's time is up)
   */
  async submitAnswer(quizId: number, userId: number, dto: SubmitQuizSessionAnswerDto): Promise<QuizSessionStateEntity> {
    const session = await this.prisma.quizSession.findFirst({
      where: { quizId, userId, finishTime: null },
    })

    if (!session) {
      throw new NotFoundException(QuizSessionErrors.NO_ACTIVE_SESSION)
    }

    // if the session's time is up -> finalize it (the submitted answer is ignored)
    if (checkIsSessionExpired(session)) {
      return this.finalizeSession(session)
    }

    const currentQuestion = session.questions[session.currentQuestionIndex]
    const isCurrentAnswerCorrect = checkIsAnswerCorrect(currentQuestion, dto.answerIndexes)

    const nextQuestionIndex = session.currentQuestionIndex + 1
    const isLastQuestionAnswered = nextQuestionIndex >= session.questionsCount

    if (isLastQuestionAnswered) {
      return this.finalizeSession(session, { isLastQuestionAnswerSuccessful: isCurrentAnswerCorrect })
    }

    const updatedSession = await this.prisma.quizSession.update({
      where: { id: session.id },
      data: {
        successfulAnswersCount: session.successfulAnswersCount + (isCurrentAnswerCorrect ? 1 : 0),
        currentQuestionIndex: nextQuestionIndex,
      },
    })

    return buildSessionState(updatedSession)
  }

  /**
   * marks the session as finished (sets "finishTime") and returns its (finished) state
   */
  private async finalizeSession(
    session: QuizSession,
    { isLastQuestionAnswerSuccessful }: { isLastQuestionAnswerSuccessful?: boolean } = {},
  ): Promise<QuizSessionStateEntity> {
    const finishTime = session.expireTime
      ? new Date(Math.min(new Date(session.expireTime).getTime(), Date.now()))
      : new Date()

    const [finishedSession] = await this.prisma.$transaction([
      this.prisma.quizSession.update({
        where: { id: session.id },
        data: {
          finishTime,
          ...(isLastQuestionAnswerSuccessful ? { successfulAnswersCount: session.successfulAnswersCount + 1 } : {}),
        },
      }),
      this.prisma.quiz.update({
        where: { id: session.quizId },
        data: { totalFinishes: { increment: 1 } },
      }),
    ])

    return buildSessionState(finishedSession)
  }
}
