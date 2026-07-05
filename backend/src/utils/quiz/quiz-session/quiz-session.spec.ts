import { QuestionType } from '@/modules/quiz/dto/create-quiz.dto'
import { makeQuizRecord, makeSessionRecord } from '@/test-utils/mocks'
import {
  buildSessionQuestions,
  buildSessionState,
  checkIsAnswerCorrect,
  checkIsSessionExpired,
  getCorrectAnswerIndexes,
  toExposedQuestion,
} from './quiz-session'

jest.mock('@/utils/shuffle', () => ({
  shuffle: (items: unknown[]) => items,
}))

describe('checkIsSessionExpired', () => {
  it('returns true when the expire time has passed', () => {
    expect(checkIsSessionExpired(makeSessionRecord({ expireTime: new Date(Date.now() - 1000) }))).toBe(true)
  })

  it('returns false when the expire time has not passed yet', () => {
    expect(checkIsSessionExpired(makeSessionRecord({ expireTime: new Date(Date.now() + 60_000) }))).toBe(false)
  })

  it('returns false when there is no time limit', () => {
    expect(checkIsSessionExpired(makeSessionRecord({ expireTime: null }))).toBe(false)
  })
})

describe('buildSessionQuestions', () => {
  it('copies checkbox/radio/cards question answers with their isCorrect attr', () => {
    const quiz = makeQuizRecord({
      questions: [
        {
          title: 'What is 2 + 2?',
          questionType: QuestionType.Radio,
          answers: [
            { text: '4', isCorrect: true },
            { text: '5', isCorrect: false },
          ],
        },
      ],
    })

    expect(buildSessionQuestions(quiz.questions)).toEqual([
      {
        title: 'What is 2 + 2?',
        questionType: QuestionType.Radio,
        answers: [
          { text: '4', isCorrect: true },
          { text: '5', isCorrect: false },
        ],
      },
    ])
  })

  it('assigns correctOrder (instead of isCorrect) for reorder questions', () => {
    const quiz = makeQuizRecord({
      questions: [
        {
          title: 'Order numbers ascending',
          questionType: QuestionType.Reorder,
          answers: [{ text: '1' }, { text: '5' }, { text: '7' }],
        },
      ],
    })

    expect(buildSessionQuestions(quiz.questions)).toEqual([
      {
        title: 'Order numbers ascending',
        questionType: QuestionType.Reorder,
        answers: [
          { text: '1', correctOrder: 0 },
          { text: '5', correctOrder: 1 },
          { text: '7', correctOrder: 2 },
        ],
      },
    ])
  })
})

describe('getCorrectAnswerIndexes', () => {
  it('returns the indexes of correct answers for a non-reorder question', () => {
    const [question] = buildSessionQuestions(
      makeQuizRecord({
        questions: [
          {
            title: 'test question',
            questionType: QuestionType.Checkbox,
            answers: [
              { text: 'a', isCorrect: true },
              { text: 'b', isCorrect: false },
              { text: 'c', isCorrect: true },
            ],
          },
        ],
      }).questions,
    )

    expect(getCorrectAnswerIndexes(question)).toEqual([0, 2])
  })

  it('returns the correct order (as indexes) for a reorder question', () => {
    const [question] = buildSessionQuestions(
      makeQuizRecord({
        questions: [
          {
            title: 'test question',
            questionType: QuestionType.Reorder,
            answers: [{ text: 'b' }, { text: 'a' }],
          },
        ],
      }).questions,
    )

    expect(getCorrectAnswerIndexes(question)).toEqual([0, 1])
  })
})

describe('checkIsAnswerCorrect', () => {
  const [checkboxQuestion] = buildSessionQuestions(
    makeQuizRecord({
      questions: [
        {
          title: 'test question',
          questionType: QuestionType.Checkbox,
          answers: [
            { text: 'a', isCorrect: true },
            { text: 'b', isCorrect: false },
            { text: 'c', isCorrect: true },
          ],
        },
      ],
    }).questions,
  )

  it('returns true when the chosen indexes exactly match the correct ones (regardless of order for non-reorder question)', () => {
    expect(checkIsAnswerCorrect(checkboxQuestion, [0, 2])).toBe(true)
    expect(checkIsAnswerCorrect(checkboxQuestion, [2, 0])).toBe(true)
  })

  it('returns false when a wrong answer is included', () => {
    expect(checkIsAnswerCorrect(checkboxQuestion, [0, 1])).toBe(false)
  })

  it('returns false for an empty answer', () => {
    expect(checkIsAnswerCorrect(checkboxQuestion, [])).toBe(false)
  })

  it('returns false for duplicated indexes', () => {
    expect(checkIsAnswerCorrect(checkboxQuestion, [0, 0])).toBe(false)
  })

  it('returns false for an out-of-range index', () => {
    expect(checkIsAnswerCorrect(checkboxQuestion, [99])).toBe(false)
  })

  it('requires the exact order for a reorder question', () => {
    const [reorderQuestion] = buildSessionQuestions(
      makeQuizRecord({
        questions: [
          {
            title: 'test question',
            questionType: QuestionType.Reorder,
            answers: [{ text: 'b' }, { text: 'a' }],
          },
        ],
      }).questions,
    )

    expect(checkIsAnswerCorrect(reorderQuestion, [0, 1])).toBe(true)
    expect(checkIsAnswerCorrect(reorderQuestion, [1, 0])).toBe(false)
  })
})

describe('toExposedQuestion', () => {
  it('omits the isCorrect/correctOrder answer attrs', () => {
    const [question] = buildSessionQuestions(
      makeQuizRecord({
        questions: [
          { title: 'What is 2 + 2?', questionType: QuestionType.Radio, answers: [{ text: '4', isCorrect: true }] },
        ],
      }).questions,
    )

    expect(toExposedQuestion(question)).toEqual({
      title: 'What is 2 + 2?',
      questionType: QuestionType.Radio,
      answers: [{ text: '4' }],
    })
  })
})

describe('buildSessionState', () => {
  it('returns the current question while the session is ongoing', () => {
    const session = makeSessionRecord({
      currentQuestionIndex: 0,
      finishTime: null,
      questions: buildSessionQuestions(
        makeQuizRecord({
          questions: [
            { title: 'What is 2 + 2?', questionType: QuestionType.Radio, answers: [{ text: '4', isCorrect: true }] },
          ],
        }).questions,
      ),
    })

    expect(buildSessionState(session)).toEqual({
      sessionId: session.id,
      questionsCount: session.questionsCount,
      currentQuestionIndex: 0,
      expireTime: session.expireTime,
      isFinished: false,
      currentQuestion: {
        title: 'What is 2 + 2?',
        questionType: QuestionType.Radio,
        answers: [{ text: '4' }],
      },
    })
  })

  it('returns the successful answers count once the session is finished', () => {
    const session = makeSessionRecord({
      currentQuestionIndex: 2,
      finishTime: new Date(),
      successfulAnswersCount: 1,
    })

    expect(buildSessionState(session)).toEqual({
      sessionId: session.id,
      questionsCount: session.questionsCount,
      currentQuestionIndex: 2,
      expireTime: session.expireTime,
      isFinished: true,
      successfulAnswersCount: 1,
    })
  })
})
