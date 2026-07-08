/**
 * This file contains shared mocks that are used by different test units
 */
import { Quiz } from '@/generated/prisma/client'
import { QuestionType } from '@/modules/quiz/dto/create-quiz.dto'
import { QuizEntity } from '@/modules/quiz/entities/quiz.entity'
import { buildSessionQuestions } from '@/utils/quiz/quiz-session'

export const CREATED_AT = new Date('2026-01-01T10:00:00.000Z')
export const UPDATED_AT = new Date('2026-01-02T10:00:00.000Z')
export const START_TIME = new Date('2026-01-03T10:00:00.000Z')
export const FINISH_TIME = new Date('2026-01-03T10:30:00.000Z')
export const PASSWORD_LAST_CHANGED_AT = new Date('2026-01-01T09:00:00.000Z')

/**
 * Mock IDs (I set each ID to a different value) so unit tests are more reliable
 * i.e. if accidentally in "expect()" the wrong ID is passed (e.g. USER_ID instead of QUIZ_ID)
 * then test will fail (which in turn will help detect the issue immediately)
 */
export const USER_ID = 4171
export const QUIZ_ID = 3519
export const REVIEW_ID = 2189
export const QUIZ_SESSION_ID = 1202
export const REQ_USER = { userId: USER_ID } // the mock of user payload (that is in runtime is taken from `req.user`)

export function makePublicUser(overrides: Record<string, any> = {}) {
  return { id: USER_ID, name: 'Amjed Omar', imageUrl: '/uploads/profiles/amjed.jpg', ...overrides }
}

export function makeUserRecord(overrides: Record<string, any> = {}) {
  return {
    id: USER_ID,
    name: 'Amjed Omar',
    email: 'amjed@example.com',
    password: 'hashed-password',
    passwordLastChangedAt: PASSWORD_LAST_CHANGED_AT,
    imageUrl: '/uploads/profiles/amjed.jpg',
    ...overrides,
  }
}

export function makeUserEntity(overrides: Record<string, any> = {}) {
  // "password" and "passwordLastChangedAt" are internal so they aren't part of the public entity
  const { password, passwordLastChangedAt, ...userEntity } = makeUserRecord()
  return { ...userEntity, ...overrides }
}

function makeQuizQuestions() {
  return [
    {
      title: 'what is 2 + 2?',
      questionType: QuestionType.Radio,
      answers: [
        { text: '4', isCorrect: true },
        { text: '5', isCorrect: false },
      ],
    },
    {
      title: 'order numbers in ascending',
      questionType: QuestionType.Reorder,
      answers: [{ text: '1' }, { text: '5' }, { text: '7' }],
    },
  ]
}

export function makeQuizRecord(overrides: Partial<Quiz> = {}): Required<QuizEntity> {
  return {
    id: QUIZ_ID,
    title: 'js basics',
    description: 'a quiz about javascript',
    timeDurationInMinutes: 30,
    imageUrl: '/uploads/quizzes/cover.jpg',
    isPublic: true,
    isAnalyticsEnabled: false,
    totalFinishes: 4,
    averageRating: 4.5,
    questions: makeQuizQuestions(),
    managerId: USER_ID,
    manager: makePublicUser(),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
    doesCurrentUserHaveActiveSession: false,
    isFavorite: false,
    wasTakenByCurrentUserAtLeastOnce: false,
    ...overrides,
  }
}

export function makeReviewRecord(overrides: Record<string, any> = {}) {
  return {
    id: REVIEW_ID,
    rating: 5,
    comment: 'great quiz',
    quizId: QUIZ_ID,
    userId: USER_ID,
    user: makePublicUser(),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
    ...overrides,
  }
}

export function makeReviewEntity(overrides: Record<string, any> = {}) {
  const { quizId, userId, user, ...reviewEntity } = makeReviewRecord()
  return { ...reviewEntity, author: user, isMine: false, ...overrides }
}

export function makeSessionRecord(overrides: Record<string, any> = {}) {
  return {
    id: QUIZ_SESSION_ID,
    startTime: START_TIME,
    expireTime: null,
    finishTime: null,
    questions: buildSessionQuestions(makeQuizQuestions()),
    questionsCount: 2,
    successfulAnswersCount: 0,
    currentQuestionIndex: 0,
    isAnalyticsShared: true,
    quizId: QUIZ_ID,
    userId: USER_ID,
    ...overrides,
  }
}
