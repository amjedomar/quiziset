import { QuizSessionAnswerEntity, QuizSessionQuestionEntity, QuestionEntityQuestionType } from '@/api-client/model'
import { CheckboxQuestion } from '@/components/quiz/quiz-session/quiz-question/checkbox-question'
import { RadioQuestion } from '@/components/quiz/quiz-session/quiz-question/radio-question'
import { CardsQuestion } from '@/components/quiz/quiz-session/quiz-question/cards-question'
import { ReorderQuestion } from '@/components/quiz/quiz-session/quiz-question/reorder-question'
import { Dispatch, SetStateAction } from 'react'

/**
 * shared props for every question-type component:
 *
 * "value" / "onChange" hold the user's answer as answer indexes:
 * - "question-reorder" -> the answers arranged in the chosen order (order matters)
 * - the other types -> the selected answers (order is ignored)
 */
export interface QuestionRendererProps {
  answers: QuizSessionAnswerEntity[]
  value: number[]
  onChange: Dispatch<SetStateAction<number[]>>
}

interface QuizQuestionProps {
  question: QuizSessionQuestionEntity
  value: number[]
  onChange: Dispatch<SetStateAction<number[]>>
}

/**
 * renders the corresponding component for the current question type
 */
export function QuizQuestion({ question, value, onChange }: QuizQuestionProps) {
  const rendererProps: QuestionRendererProps = { answers: question.answers, value, onChange }

  switch (question.questionType) {
    case QuestionEntityQuestionType['question-radio']:
      return <RadioQuestion {...rendererProps} />

    case QuestionEntityQuestionType['question-reorder']:
      return <ReorderQuestion {...rendererProps} />

    case QuestionEntityQuestionType['question-cards']:
      return <CardsQuestion {...rendererProps} />

    case QuestionEntityQuestionType['question-checkbox']:
    default:
      return <CheckboxQuestion {...rendererProps} />
  }
}
