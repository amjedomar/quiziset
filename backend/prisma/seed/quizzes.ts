import type { PrismaClient, User } from '@/generated/prisma/client'
import {
  QUIZ_QUESTIONS,
  QUIZZES_LIST,
  QUIZ_CREATED_BASE,
  STAR_COMMENTS,
  REVIEW_CREATED_BASE,
  SESSION_CREATED_BASE,
  TEST_USERS,
  TIME_LIMIT_OPTIONS,
} from './config'

import { addDays, addMinutes } from '@/utils/date'
import { round1 } from '@/utils/math'
import { toTitleCase } from '@/utils/string'
import { getQuizSampleImagePath } from '@/utils/sample-images'
import { buildSessionQuestions } from '@/utils/quiz/quiz-session'

/**
 * seeds quiz together with its finished sessions and its reviews
 */
export async function seedQuiz(prisma: PrismaClient, users: User[], managerId: number, quizIndex: number) {
  const quizSeed = QUIZZES_LIST[quizIndex]
  const quizName = quizSeed.name

  // analytics is enabled for even quiz indexes (0, 2, 4 ...) otherwise it is disabled
  // but if it is `quizSeed.isOneSessionInProgress` then force the isAnalyticsEnabled to be true
  const isAnalyticsEnabled = quizSeed.isForceAnalyticsEnabled || quizSeed.isOneSessionInProgress || quizIndex % 2 === 0

  // pick timeDuration randomly (based on the modulo residual)
  // but if it is `quizSeed.isOneSessionInProgress` then force the timeDurationInMinutes to be null (i.e. no time-limit)
  const timeDurationInMinutes = quizSeed.isOneSessionInProgress
    ? null
    : TIME_LIMIT_OPTIONS[quizIndex % TIME_LIMIT_OPTIONS.length]

  // spread the hardcoded totalFinishes across every user
  const finishCounts = distributeEvenly(quizSeed.totalFinishes, users.length)

  const hasReviews = quizSeed.reviewRatings.length > 0

  const perUser = users.map((user, userIndex) => {
    // the review rating is hardcoded per user and its comment is picked by userIndex
    const rating = quizSeed.reviewRatings[userIndex]
    const comment = hasReviews ? STAR_COMMENTS[rating][userIndex] : ''

    return {
      user,
      finishCount: finishCounts[userIndex],
      review: { rating, comment },
    }
  })

  // totalFinishes matches the sessions (which I created below see "session" const)
  const totalFinishes = quizSeed.totalFinishes

  // averageRating is calculated based on the rating of the reviews
  const averageRating = hasReviews
    ? round1(quizSeed.reviewRatings.reduce((sum, rating) => sum + rating, 0) / quizSeed.reviewRatings.length)
    : 0

  // quizzes at the top of QUIZZES_LIST (e.g. index 0) get the newest createdAt
  const quizCreatedAt = addDays(QUIZ_CREATED_BASE, QUIZZES_LIST.length - 1 - quizIndex)

  const quiz = await prisma.quiz.create({
    data: {
      title: toTitleCase(quizName),
      description: `Test your knowledge of ${quizName} this quiz has ${QUIZ_QUESTIONS.length} questions one of each type (checkbox, radio, reorder, and cards)`,
      timeDurationInMinutes,
      imageUrl: getQuizSampleImagePath(quizName),
      isPublic: !quizSeed.isPrivate,
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

  // some quizzes additionally get one in-progress session (i.e. when `isOneSessionInProgress` true)
  let inProgressCount = 0

  if (quizSeed.isOneSessionInProgress) {
    const nonOwner = users[1] // the 2nd user (a non-owner since the first user owns every quiz)

    await prisma.quizSession.create({
      data: {
        quizId: quiz.id,
        userId: nonOwner.id,
        startTime: addDays(SESSION_CREATED_BASE, 10),
        expireTime: null,
        finishTime: null,
        questions: buildSessionQuestions(QUIZ_QUESTIONS),
        questionsCount: QUIZ_QUESTIONS.length,
        successfulAnswersCount: 1,
        currentQuestionIndex: QUIZ_QUESTIONS.length - 2,
        isAnalyticsShared: isAnalyticsEnabled,
      },
    })

    inProgressCount = 1
  }

  // one review per user
  const reviews = !hasReviews
    ? []
    : perUser.map(({ user, review }, userIndex) => {
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

  return { quizId: quiz.id, sessionsCount: sessions.length + inProgressCount, reviewsCount: reviews.length }
}

function distributeEvenly(total: number, count: number): number[] {
  const base = Math.floor(total / count)
  const remainder = total % count
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0))
}
