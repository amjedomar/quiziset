'use client'

import { Button, Stack, Typography, Link } from '@mui/joy'
import { FormInput } from '@/ui/form-fields/form-input'
import { FormTextarea } from '@/ui/form-fields/form-textarea'
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import SaveIcon from '@mui/icons-material/Save'
import { useCallback, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormImage } from '@/ui/form-fields/form-image'
import styles from './quiz-form.module.scss'
import { QuizQuestionForm } from '@/components/quiz/question-form'
import NewQuestionAction from '@/components/quiz/new-question-action/new-question-action'
import { QuestionType } from '@/components/quiz/question-type-select'
import { QuizTimeDurationSelect } from '@/components/quiz/quiz-time-duration-select'
import { quizSchema, QuizFormData } from '@/components/quiz/quiz-form/quiz-schema'
import { FormSwitch } from '@/ui/form-fields/form-switch'
import { useCreateQuiz, useDeleteQuiz, useUpdateQuiz } from '@/generated-api-client/quiz'
import { useRouter } from 'next/navigation'
import { ErrorResponse, QuizEntity } from '@/generated-api-client/model'
import DeleteIcon from '@mui/icons-material/Delete'
import { isErrorResponse } from '@/utils/is-error-response'
import { useSnackbar } from '@/components/snackbar'
import { ConfirmDeleteModal } from '@/components/confirm-delete-modal'
import { ShareQuizButton } from '@/components/quiz/share-quiz-button'
import NextLink from 'next/link'

const defaultQuestion = {
  title: '',
  questionType: QuestionType.Checkbox,
  answers: [{ text: '' }, { text: '' }, { text: '' }],
}

const newQuizDefaults = { isPublic: true, timeDurationInMinutes: null, questions: [defaultQuestion] }

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

  const { showError, showSuccess } = useSnackbar()

  const { mutateAsync: createQuiz, isPending: isCreating } = useCreateQuiz()
  const { mutateAsync: updateQuiz, isPending: isUpdating } = useUpdateQuiz()
  const { mutateAsync: deleteQuiz, isPending: isDeleting } = useDeleteQuiz()

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    // QuizEntity is a superset of QuizData (it adds e.g. id/managerId/createdAt/updatedAt)
    // so it can be used directly as the form's default values
    defaultValues: existingQuiz ?? newQuizDefaults,
  })

  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  const isPublic = useWatch({ control: form.control, name: 'isPublic' })

  const onSubmit = useCallback(
    async (data: QuizFormData) => {
      let responseData: QuizEntity | ErrorResponse
      if (existingQuiz) {
        responseData = (await updateQuiz({ id: existingQuiz.id, data })).data
      } else {
        responseData = (await createQuiz({ data })).data
      }

      if (isErrorResponse(responseData)) {
        showError(responseData.message)
      } else {
        const quizOverviewLink = `/quizzes/${responseData.id}/overview`

        if (existingQuiz) {
          showSuccess(
            <>
              <span>Quiz updated Successfully!</span>

              <Link component={NextLink} href={quizOverviewLink} underline="always">
                View Quiz
              </Link>
            </>,
          )
        } else {
          router.push(quizOverviewLink)
          showSuccess('Quiz created successfully!')
        }
      }
    },
    [existingQuiz, updateQuiz, createQuiz, showError, showSuccess, router],
  )

  const onValidationError = useCallback(() => {
    showError(
      'Please make sure to fill all fields & in case of checkbox/cards/radio questions make sure to select at least one answer',
      { autoHideDuration: 10000 },
    )
  }, [showError])

  const onDelete = useCallback(async () => {
    if (!existingQuiz) return // if form is in "create" mode then return

    const response = await deleteQuiz({ id: existingQuiz.id })

    if (isErrorResponse(response.data)) {
      showError(response.data.message)
    } else {
      showSuccess('Quiz was deleted successfully!')
      router.push('/manage-quizzes')
    }
  }, [deleteQuiz, existingQuiz, router, showError, showSuccess])

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onValidationError)} noValidate>
        <Stack direction="column" spacing={3}>
          <div className={styles.header}>
            <Typography level="h3">{existingQuiz ? 'Update Quiz' : 'Create New Quiz'}</Typography>

            {existingQuiz && (
              <ShareQuizButton quizId={existingQuiz.id} size="md" labelDisplay="responsive" disabled={!isPublic} />
            )}
          </div>

          <div className={styles.switches}>
            <FormSwitch name="isPublic" label="Public" />
            <FormSwitch name="isAnalyticsEnabled" label="Analytics" />
          </div>

          <div className={styles.overviewSection}>
            <Stack direction="column" spacing={3}>
              <FormInput name="title" label="Title" />
              <FormTextarea name="description" label="Description" minRows={4} maxRows={6} />
              <QuizTimeDurationSelect name="timeDurationInMinutes" />
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

          <NewQuestionAction onCreate={(questionType) => addQuestion({ ...defaultQuestion, questionType })} />
        </Stack>

        <div className={styles.footerActions}>
          <Button
            data-testid="quiz-form-submit-button"
            variant="soft"
            startDecorator={<SaveIcon />}
            type="submit"
            loading={isCreating || isUpdating}
          >
            {existingQuiz ? 'Update Quiz' : 'Create Quiz'}
          </Button>

          {existingQuiz && (
            <>
              <Button
                className={styles.deleteButton}
                variant="outlined"
                color="danger"
                startDecorator={<DeleteIcon />}
                onClick={() => setIsConfirmingDelete(true)}
              >
                Delete
              </Button>

              <ConfirmDeleteModal
                open={isConfirmingDelete}
                isDeleting={isDeleting}
                title="Delete quiz"
                message="Are you sure you want to delete this quiz?"
                onConfirm={onDelete}
                onCancel={() => setIsConfirmingDelete(false)}
              />
            </>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
