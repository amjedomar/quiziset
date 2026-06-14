'use client'

import { Button, Stack, Typography } from '@mui/joy'
import { FormInput } from '@/ui/form-fields/form-input'
import { FormTextarea } from '@/ui/form-fields/form-textarea'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import SaveIcon from '@mui/icons-material/Save'
import { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormImage } from '@/ui/form-fields/form-image'
import styles from './quiz-form.module.scss'
import { QuizQuestionForm } from '@/components/quiz/question-form'
import NewQuestionAction from '@/components/quiz/new-question-action/new-question-action'
import { QuestionType } from '@/components/quiz/question-type-select'
import { quizSchema, QuizFormData } from '@/components/quiz/quiz-form/quiz-schema'
import { FormSwitch } from '@/ui/form-fields/form-switch'
import { useCreateQuiz, useUpdateQuiz } from '@/api-client/quiz'
import { useRouter } from 'next/navigation'
import { QuizEntity } from '@/api-client/model'

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
  existingQuiz?: QuizEntity
}

export function QuizForm({ existingQuiz }: QuizFormProps) {
  const router = useRouter()
  const { mutateAsync: createQuiz } = useCreateQuiz()
  const { mutateAsync: updateQuiz } = useUpdateQuiz()

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    // QuizEntity is a superset of QuizData (it adds e.g. id/managerId/createdAt/updatedAt)
    // so it can be used directly as the form's default values
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

  const onSubmit = useCallback(
    async (data: QuizFormData) => {
      if (existingQuiz) {
        await updateQuiz({ id: existingQuiz.id, data })
      } else {
        await createQuiz({ data })
      }

      router.push('/manage-quizzes')
    },
    [existingQuiz, createQuiz, updateQuiz, router],
  )

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={3}>
          <Typography level="h3">{existingQuiz ? 'Update Quiz' : 'Create New Quiz'}</Typography>

          <Stack alignItems="flex-start" direction="column" spacing={0.5}>
            <FormSwitch name="isPublic" label="Public" />
            <FormSwitch name="isAnalyticsEnabled" label="Analytics" />
          </Stack>

          <div className={styles.overviewSection}>
            <Stack direction="column" spacing={3}>
              <FormInput name="title" label="Title" />
              <FormTextarea name="description" label="Description" minRows={4} maxRows={6} />
            </Stack>

            <FormImage name="imageUrl" label="Image" bucketName="quizzes" />
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
              {existingQuiz ? 'Update Quiz' : 'Create Quiz'}
            </Button>
          </div>
        </Stack>
      </form>
    </FormProvider>
  )
}
