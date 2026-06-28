import type { PrismaClient, User } from '@/generated/prisma/client'
import {
  QUIZ_QUESTIONS,
  QUIZZES_LIST,
  QUIZ_CREATED_BASE,
  REVIEWS_LIST,
  REVIEW_CREATED_BASE,
  SESSION_CREATED_BASE,
  TEST_USERS,
  TIME_LIMIT_OPTIONS,
} from './config'

import { addDays, addMinutes } from '@/utils/date.util'
import { round1 } from '@/utils/math.util'
import { toTitleCase } from '@/utils/string.util'
import { getQuizSampleImagePath } from '@/utils/sample-images.util'
import { buildSessionQuestions } from '@/utils/quiz/quiz-session.util'

/**
 * seeds quiz together with its finished sessions and its reviews
 */
export async function seedQuiz(prisma: PrismaClient, users: User[], managerId: number, quizIndex: number) {
  const quizName = QUIZZES_LIST[quizIndex]

  // analytics is enabled for even quiz indexes (0, 2, 4 ...) otherwise it is disabled
  const isAnalyticsEnabled = quizIndex % 2 === 0

  // pick timeDuration randomly (based on the modulo residual)
  const timeDurationInMinutes = TIME_LIMIT_OPTIONS[quizIndex % TIME_LIMIT_OPTIONS.length]

  const perUser = users.map((user, userIndex) => ({
    user,
    // randomly decide how many times a user will finish this quiz (1 to 3)
    finishCount: ((quizIndex + userIndex) % 3) + 1,
    // pick random review
    review: REVIEWS_LIST[(quizIndex + userIndex) % REVIEWS_LIST.length],
  }))

  // set the totalFinishes and averageRating (to match the sessions/reviews that I created later below)
  const totalFinishes = perUser.reduce((sum, user) => sum + user.finishCount, 0)
  const averageRating = round1(perUser.reduce((sum, user) => sum + user.review.rating, 0) / perUser.length)

  /**
   * make sure that quizzes in the top of the QUIZZES_LIST (e.g. index 0)
   * have the newest time (so in frontend they appear at same order
   * as QUIZZES_LIST) because default sorting returned from Backend is "newest" first
   */
  const quizCreatedAt = addDays(QUIZ_CREATED_BASE, QUIZZES_LIST.length - 1 - quizIndex)

  const quiz = await prisma.quiz.create({
    data: {
      title: toTitleCase(quizName),
      description: `Test your knowledge of ${quizName} this quiz has ${QUIZ_QUESTIONS.length} questions one of each type (checkbox, radio, reorder, and cards)`,
      timeDurationInMinutes,
      imageUrl: getQuizSampleImagePath(quizName),
      isPublic: true,
      isAnalyticsEnabled,
      totalFinishes,
      averageRating,
      questions: QUIZ_QUESTIONS,
      managerId,
      createdAt: quizCreatedAt,
    },
  })

  // build the finished sessions (consistent with the quiz time limit and questions)
  const sessions = perUser.flatMap(({ user, finishCount }, userIndex) =>
    Array.from({ length: finishCount }, (_, attemptIndex) => {
      // random startTime based on modulo residual
      // btw these numbers 13/7/11 I picked them randomly (same as 10 & 600)
      const dayOffset = (quizIndex + userIndex + attemptIndex) % 10
      const minuteOffset = (quizIndex * 13 + userIndex * 7 + attemptIndex * 11) % 600
      const startTime = addMinutes(addDays(SESSION_CREATED_BASE, dayOffset), minuteOffset)

      // the session expires only when the quiz has a time limit
      const expireTime = timeDurationInMinutes !== null ? addMinutes(startTime, timeDurationInMinutes) : null

      // random finish time (again based on modulo residual)
      const durationCap = timeDurationInMinutes ?? 60
      const finishTime = addMinutes(startTime, ((quizIndex + userIndex + attemptIndex) % durationCap) + 1)

      // random successfulAnswersCount
      const successfulAnswersCount = ((quizIndex + userIndex + attemptIndex) % QUIZ_QUESTIONS.length) + 1

      // a session finished by answering all questions stops at the last question index
      const questionsCount = QUIZ_QUESTIONS.length
      const currentQuestionIndex = questionsCount - 1

      // analytics is shared only when the quiz requires it
      const isAnalyticsShared = isAnalyticsEnabled

      return {
        quizId: quiz.id,
        userId: user.id,
        startTime,
        expireTime,
        finishTime,
        questions: buildSessionQuestions(QUIZ_QUESTIONS),
        questionsCount,
        successfulAnswersCount,
        currentQuestionIndex,
        isAnalyticsShared,
      }
    }),
  )

  await prisma.quizSession.createMany({ data: sessions })

  // one review per user
  const reviews = perUser.map(({ user, review }, userIndex) => {
    // set random createdAt
    const createdAt = addDays(REVIEW_CREATED_BASE, (quizIndex + userIndex) % TEST_USERS.length)

    return {
      quizId: quiz.id,
      userId: user.id,
      rating: review.rating,
      comment: review.comment,
      createdAt,
      updatedAt: createdAt,
    }
  })

  await prisma.review.createMany({ data: reviews, skipDuplicates: true })

  return { quizId: quiz.id, sessionsCount: sessions.length, reviewsCount: reviews.length }
}
