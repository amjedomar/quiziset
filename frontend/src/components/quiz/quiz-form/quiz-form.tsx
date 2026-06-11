'use client'

import { Button, Stack, Typography } from '@mui/joy'
import { FormInput } from '@/ui/form-fields/form-input'
import { FormTextarea } from '@/ui/form-fields/form-textarea'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import SaveIcon from '@mui/icons-material/Save'
import { useCallback } from 'react'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormImage } from '@/ui/form-fields/form-image'
import styles from './quiz-form.module.scss'
import { QuizQuestionForm } from '@/components/quiz/quiz-question-form'
import NewQuestionAction from '@/components/quiz/new-question-action/new-question-action'
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
    if (data.questionType !== QuestionType.Checkbox && data.questionType !== QuestionType.Radio) {
      return
    }

    const hasCorrectAnswer = data.answers.some((answer) => answer.isCorrect === true)
    if (!hasCorrectAnswer) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please select at least one correct answer',
        path: ['answers'],
      })
    }
  })

export const schema = z.object({
  title: z.string().nonempty('Please enter a title'),
  description: z.string().nonempty('Please enter a description'),
  image: z.string().nonempty('Please upload an image'),
  questions: z.array(questionSchema).min(1, 'Please add at least one question'),
})

type QuizData = z.infer<typeof schema>

const defaultQuestion = {
  title: '',
  questionType: QuestionType.Checkbox,
  answers: [{ text: '' }, { text: '' }, { text: '' }],
}

interface QuizFormProps {
  /**
   * "existingQuiz" prop should be passed only if you want the form to behave
   * as an "Update" form for an existing quiz.
   *
   * Otherwise, if not passed it will behave as "Create" form
   */
  existingQuiz?: QuizData
}

export function QuizForm({ existingQuiz }: QuizFormProps) {
  const form = useForm<QuizData>({
    resolver: zodResolver(schema),
    defaultValues: existingQuiz ?? { questions: [defaultQuestion] },
  })

  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  console.log('debugging questions', questions)

  const onSubmit = useCallback((data: QuizData) => {
    console.log('debugging quiz data', data)
  }, [])

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={3}>
          <Typography level="h3">Create New Quiz</Typography>

          <div className={styles.overviewSection}>
            <Stack direction="column" spacing={3}>
              <FormInput name="title" label="Title" />
              <FormTextarea name="description" label="Description" minRows={4} maxRows={6} />
            </Stack>

            <FormImage name="image" label="Image" />
          </div>

          {questions.map((question, index) => (
            <QuizQuestionForm
              key={question.id}
              questionFieldName={`questions.${index}`}
              onDelete={() => removeQuestion(index)}
              disableDeletion={questions.length <= 1}
              index={index}
            />
          ))}

          <div className={styles.footerActions}>
            <NewQuestionAction onCreate={(questionType) => addQuestion({ ...defaultQuestion, questionType })} />
            <Button variant="soft" startDecorator={<SaveIcon />} type="submit">
              Create Quiz
            </Button>
          </div>
        </Stack>
      </form>
    </FormProvider>
  )
}
