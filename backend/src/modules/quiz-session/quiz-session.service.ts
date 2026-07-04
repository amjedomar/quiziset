import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma-service'
import { StartQuizSessionDto } from '@/modules/quiz-session/dto/start-quiz-session.dto'
import { SubmitQuizSessionAnswerDto } from '@/modules/quiz-session/dto/submit-quiz-session-answer.dto'
import { QuizSessionStateEntity } from '@/modules/quiz-session/entities/quiz-session.entity'
import { QuizSessionErrors } from '@/modules/quiz/quiz.errors'
import { QuizSession } from '@/generated/prisma/client'
import { findAccessibleQuizOrThrow } from '@/utils/quiz/quiz-access'
import {
  buildSessionQuestions,
  checkIsAnswerCorrect,
  checkIsSessionExpired,
  buildSessionState,
} from '@/utils/quiz/quiz-session'

@Injectable()
export class QuizSessionService {
  constructor(private prisma: PrismaService) {}

  /**
   * starts a new quiz session OR resumes the user's active session (if there is)
   *
   * when there is no active session and the quiz has analytics enabled the user
   * must explicitly agree to share analytics (via "isAnalyticsShared") otherwise a 400
   * response error is thrown
   */
  async startSession(quizId: number, userId: number, dto: StartQuizSessionDto): Promise<QuizSessionStateEntity> {
    // "findAccessibleQuizOrThrow" ensures access is allowed
    // i.e. it throws 404 if quiz doesn't exists OR 403 if the quiz is private and not owned
    const quiz = await findAccessibleQuizOrThrow(this.prisma, quizId, userId)

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
   * This method first ensure there is an existing session
   *
   * Then it checks if time is already up --> it finalizes the session
   * (without grading the last answer) and returns the result `successfulAnswersCount
   *
   * if time isn't up yet then it checks if "dto.questionIndex" matches "session.currentQuestionIndex"
   *   - if yes --> it grades the user's answer of the current question and returns the next question
   *   - if no --> it just return the latest question data
   */
  async submitAnswer(quizId: number, userId: number, dto: SubmitQuizSessionAnswerDto): Promise<QuizSessionStateEntity> {
    const session = await this.prisma.quizSession.findFirst({
      where: { quizId, userId, finishTime: null },
    })

    if (!session) {
      throw new NotFoundException(QuizSessionErrors.NO_ACTIVE_SESSION)
    }

    // if the session's time is up --> finalize it (the submitted answer is ignored)
    if (checkIsSessionExpired(session)) {
      return this.finalizeSession(session)
    }

    // the quiz could be open in another tab that already moved on
    // so if this answer is for an old question --> ignore it and just return the current state
    // (this way the old tab syncs with the latest question instead of grading a wrong answer)
    if (dto.questionIndex !== session.currentQuestionIndex) {
      return buildSessionState(session)
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
   * finds all "expired" sessions (i.e. whose time limit has passed) then finalizes them
   *
   * we run this before reading quizzes so the returned data is accurate
   * E.g. the "totalFinishes" count and the "doesCurrentUserHaveActiveSession"
   */
  async finalizeAllExpiredSessions(): Promise<void> {
    const expiredSessions = await this.prisma.quizSession.findMany({
      where: {
        finishTime: null,
        expireTime: { not: null, lte: new Date() },
      },
    })

    // finalize each (sets finishTime = its expireTime and increments quiz.totalFinishes)
    await Promise.all(expiredSessions.map((session) => this.finalizeSession(session)))
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
