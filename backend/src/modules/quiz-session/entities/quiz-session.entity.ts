import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { QuestionType } from '@/modules/quiz/dto/create-quiz.dto'

/**
 * The type of the internal stored answer (in the `questions` Json column of `QuizSession` table)
 *
 * It has the attrs that indicates whether it is correct ("isCorrect" / "correctOrder")
 *   - btw these two attrs aren't returned to frontend
 *   - instead another type "QuizSessionAnswerEntity" (check it below)
 *     is returned to frontend with only `text` / `imageUrl`
 */
export interface QuizSessionStoredAnswer {
  text: string
  imageUrl?: string // provided for "question-cards" only
  isCorrect?: boolean // provided for every question type except "question-reorder"
  correctOrder?: number // provided for "question-reorder" only: the answer's index in the correct order
}

/**
 * This is a copy of the quiz questions stored (in the `QuizSession` table)
 *
 * Why do we need to store a copy?
 * --> so if the quiz manager updated the questions (while user is taking the quiz
 * it won't affect the user i.e. the same number of questions shown
 * in the progress bar will remain the same)
 *
 * please note that these "question" is kept in backend only
 * it isn't exposed entirely to the quiz taker in frontend
 *
 * only the current question is returned (without isCorrect/correctOrder answer attrs)
 * so quiz taker CANNOT know the correct answer by checking the response
 * in the "Network" tab using devtools
 */
export interface QuizSessionStoredQuestion {
  title: string
  questionType: QuestionType
  answers: QuizSessionStoredAnswer[]
}

/**
 * The answer type returned to the frontend (isCorrect/correctOrder attrs are omitted)
 */
class QuizSessionAnswerEntity {
  @ApiProperty() text: string

  @ApiPropertyOptional({ description: 'provided for "question-cards" only' })
  imageUrl?: string
}

/**
 * The current question returned to the frontend
 * (again in "answers" the isCorrect/correctOrder attrs are omitted)
 */
export class QuizSessionQuestionEntity {
  @ApiProperty() title: string

  @ApiProperty({ enum: QuestionType }) questionType: QuestionType

  @ApiProperty({ type: [QuizSessionAnswerEntity] }) answers: QuizSessionAnswerEntity[]
}

/**
 * The state that is returned when starting/resuming a session & after each answer:
 * - while the quiz session is ongoing --> "currentQuestion" is returned
 * - once the quiz session is finished --> "isFinished" is true and "successfulAnswersCount" is returned
 */
export class QuizSessionStateEntity {
  @ApiProperty() sessionId: number

  @ApiProperty() questionsCount: number

  @ApiProperty() currentQuestionIndex: number

  @ApiProperty({ type: Date, nullable: true, description: 'null when the quiz has no time limit' })
  expireTime: Date | null

  @ApiProperty({ description: 'true once the quiz is finished (in this case "successfulAnswersCount" is returned)' })
  isFinished: boolean

  @ApiPropertyOptional({
    type: QuizSessionQuestionEntity,
    description: 'the current question to answer (omitted once the quiz is finished)',
  })
  currentQuestion?: QuizSessionQuestionEntity

  @ApiPropertyOptional({ description: 'number of correctly answered questions (returned only once finished)' })
  successfulAnswersCount?: number
}
