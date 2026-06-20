import { QuizSession } from '@/generated/prisma/client'
import { QuestionType } from '@/modules/quiz/dto/create-quiz.dto'
import {
  QuizSessionQuestionEntity,
  QuizSessionStateEntity,
  QuizSessionStoredQuestion,
} from '@/modules/quiz/entities/quiz-session.entity'
import { QuizEntity } from '@/modules/quiz/entities/quiz.entity'
import { shuffle } from '@/utils/shuffle'

/**
 * a session is expired when it has a time limit ("expireTime") that has already passed
 */
export function checkIsSessionExpired(session: QuizSession): boolean {
  return session.expireTime !== null && session.expireTime.getTime() <= Date.now()
}

/**
 * builds the session's questions from the quiz questions:
 * - questions are shuffled (and each question's answers are shuffled too)
 * - the "isCorrect" or "correctOrder" attr is assigned depending on the question type:
 *   - "question-reorder" -> "correctOrder" (the answer's index in the original/correct order)
 *   - the other types -> "isCorrect"
 *
 * if you wanna know why we need to copy quiz questions (check the code comment
 * I wrote for "QuizSessionStoredQuestion" type in "quiz-session.entity.ts" file)
 */
export function buildSessionQuestions(questions: QuizEntity['questions']): QuizSessionStoredQuestion[] {
  return shuffle(questions).map((question) => {
    const isReorder = question.questionType === QuestionType.Reorder

    // for "question-reorder" only --> the original answers order is the correct order
    const answersWithCorrectOrder = question.answers.map((answer, originalIndex) => ({
      ...answer,
      correctOrder: originalIndex,
    }))

    return {
      title: question.title,
      questionType: question.questionType,
      answers: shuffle(answersWithCorrectOrder).map((answer) => ({
        text: answer.text,
        imageUrl: answer.imageUrl,
        isCorrect: isReorder ? undefined : answer.isCorrect,
        correctOrder: isReorder ? answer.correctOrder : undefined,
      })),
    }
  })
}

/**
 * checks the user's answer for the given question
 */
export function checkIsAnswerCorrect(question: QuizSessionStoredQuestion, answerIndexes: number[]): boolean {
  const { answers } = question

  // if answerIndexes is empty return false
  if (answerIndexes.length === 0) {
    return false
  }

  // if there are duplicated indexes within "answerIndexes" then return false
  if (new Set(answerIndexes).size !== answerIndexes.length) {
    return false
  }

  /**
   * if there is an index in "answerIndexes" that is either:
   *  - non-integer
   *  - or out-of-range
   * then also return false
   */
  if (answerIndexes.some((index) => !Number.isInteger(index) || index < 0 || index >= answers.length)) {
    return false
  }

  if (question.questionType === QuestionType.Reorder) {
    return (
      answerIndexes.length === answers.length &&
      answerIndexes.every((answerIndex, chosenOrder) => answers[answerIndex].correctOrder === chosenOrder)
    )
  } else {
    // checkbox / radio / cards questions
    const correctIndexes: number[] = []

    answers.forEach((answer, index) => {
      if (answer.isCorrect) {
        correctIndexes.push(index)
      }
    })

    return (
      answerIndexes.length === correctIndexes.length && correctIndexes.every((index) => answerIndexes.includes(index))
    )
  }
}

/**
 * omits the isCorrect/correctOrder attrs from the question answers
 * (because we don't wanna the quiz taker to know them by checking
 * the responses in the "Network" tab devtools)
 *
 * Thus, the result of this function can be safely returned to the frontend
 */
function toExposedQuestion(question: QuizSessionStoredQuestion): QuizSessionQuestionEntity {
  return {
    title: question.title,
    questionType: question.questionType,
    answers: question.answers.map((answer) => ({
      text: answer.text,
      imageUrl: answer.imageUrl,
    })),
  }
}

/**
 * maps a session data (that is fetched from DB) to the state that is exposed to the frontend
 * - while session is still ongoing --> the current question is returned
 *   (keep in mind that isCorrect/correctOrder attrs is omitted from answers
 *   as explained in "toExposedQuestion" function above)
 * - once finished --> the result "successfulAnswersCount" is returned
 *
 * NOTE!!: the session "questions" aren't exposed to frontend as it is
 * instead only current question is returned (without isCorrect/correctOrder answers attrs)
 */
export function buildSessionState(session: QuizSession): QuizSessionStateEntity {
  const isFinished = session.finishTime !== null

  const state: QuizSessionStateEntity = {
    sessionId: session.id,
    questionsCount: session.questionsCount,
    currentQuestionIndex: session.currentQuestionIndex,
    expireTime: session.expireTime,
    isFinished,
  }

  if (isFinished) {
    state.successfulAnswersCount = session.successfulAnswersCount
  } else {
    state.currentQuestion = toExposedQuestion(session.questions[session.currentQuestionIndex])
  }

  return state
}
