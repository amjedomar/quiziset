import z from 'zod'
import { QuestionType } from '@/components/quiz/question-type-select'

const answerSchema = z.object({
  text: z.string().nonempty('Please enter answer text'),
  isCorrect: z.boolean().optional(),
})

const questionSchema = z
  .object({
    title: z.string().nonempty('Please enter a question title'),
    questionType: z.enum(QuestionType),
    answers: z.array(answerSchema).min(2, 'Please provide at least two answers'),
  })
  .superRefine((data, ctx) => {
    if (data.questionType !== QuestionType.Reorder) {
      const hasCorrectAnswer = data.answers.some((answer) => answer.isCorrect === true)

      if (!hasCorrectAnswer) {
        const errorMessage =
          data.questionType === QuestionType.Radio
            ? 'Please select the correct answer'
            : 'Please select at least one correct answer'

        ctx.addIssue({
          code: 'custom',
          message: errorMessage,
          /**
           * set the path to the first answer's "isCorrect" field (which is Checkbox or Radio)
           * this will make sure that this checkbox/radio is focused when the error is shown
           * Therefore it will scroll to it
           */
          path: ['answers.0.isCorrect'],
        })
      }
    }
  })

export const quizSchema = z.object({
  title: z.string().nonempty('Please enter a title'),
  description: z.string().nonempty('Please enter a description'),
  image: z.string().nonempty('Please upload an image'),
  questions: z.array(questionSchema).min(1, 'Please add at least one question'),
})

export type QuizData = z.infer<typeof quizSchema>
