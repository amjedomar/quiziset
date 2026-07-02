/**
 * This file contains shared mocks that are used by different test units
 */
import {
  PublicUserEntity,
  QuestionEntity,
  QuestionEntityQuestionType,
  QuizAnalyticsSessionEntity,
  QuizEntity,
  QuizSessionAnswerEntity,
  QuizSessionQuestionEntity,
  QuizSessionQuestionEntityQuestionType,
  QuizSessionStateEntity,
} from '@/generated-api-client/model'

type QuestionType = QuestionEntityQuestionType

const ANSWERS_BY_QUESTION_TYPE: Record<QuestionType, QuestionEntity['answers']> = {
  'question-checkbox': [
    { text: 'Answer A', isCorrect: true },
    { text: 'Answer B', isCorrect: false },
  ],
  'question-radio': [
    { text: 'Answer A', isCorrect: true },
    { text: 'Answer B', isCorrect: false },
  ],
  'question-cards': [
    { text: 'Answer A', imageUrl: '/uploads/quizzes/answer-a.png', isCorrect: true },
    { text: 'Answer B', imageUrl: '/uploads/quizzes/answer-b.png', isCorrect: false },
  ],
  'question-reorder': [{ text: '1st' }, { text: '2nd' }, { text: '3rd' }],
}

export function makeQuizQuestion(questionType: QuestionType, overrides: Partial<QuestionEntity> = {}): QuestionEntity {
  return {
    title: 'What is 2 + 2?',
    questionType,
    answers: ANSWERS_BY_QUESTION_TYPE[questionType],
    ...overrides,
  }
}

export function makeQuizSessionQuestion(
  questionType: QuizSessionQuestionEntityQuestionType,
  overrides: Partial<QuizSessionQuestionEntity> = {},
): QuizSessionQuestionEntity {
  const { title, answers } = makeQuizQuestion(questionType)

  // the session's answers never expose "isCorrect" to frontend (i.e. it isn't returned from BE)
  const sessionAnswers: QuizSessionAnswerEntity[] = answers.map(({ text, imageUrl }) => ({ text, imageUrl }))

  return { title, questionType, answers: sessionAnswers, ...overrides }
}

export function makeQuizSessionState(overrides: Partial<QuizSessionStateEntity> = {}): QuizSessionStateEntity {
  return {
    sessionId: 1,
    questionsCount: 5,
    currentQuestionIndex: 0,
    expireTime: null,
    isFinished: false,
    currentQuestion: makeQuizSessionQuestion('question-checkbox'),
    ...overrides,
  }
}

export function makePublicUser(overrides: Partial<PublicUserEntity> = {}): PublicUserEntity {
  return { id: 1, name: 'Amjed Omar', imageUrl: null, ...overrides }
}

export function makeQuizAnalyticsSession(
  overrides: Partial<QuizAnalyticsSessionEntity> = {},
): QuizAnalyticsSessionEntity {
  return {
    id: 1,
    user: makePublicUser(),
    questionsCount: 5,
    successfulAnswersCount: 3,
    startTime: '2026-01-01T10:00:00.000Z',
    finishTime: '2026-01-01T10:30:00.000Z',
    ...overrides,
  }
}

export function makeQuiz(overrides: Partial<QuizEntity> = {}): QuizEntity {
  return {
    id: 1,
    title: 'JS Basics',
    description: 'A quiz about javascript',
    timeDurationInMinutes: 30,
    imageUrl: '/uploads/quizzes/cover.png',
    isPublic: true,
    isAnalyticsEnabled: false,
    averageRating: 4.5,
    totalFinishes: 3,
    isFavorite: false,
    managerId: 1,
    manager: makePublicUser(),
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
    ...overrides,
  }
}
