'use client'

import { CircularProgress, Container, Stack } from '@mui/joy'
import { useGetSingleQuiz } from '@/generated-api-client/quiz'
import { QuizForm } from '@/components/quiz/quiz-form'
import { ErrorResponseView } from '@/components/error-response-view'
import { isErrorResponse } from '@/utils/is-error-response'

interface QuizUpdateFormProps {
  quizId: number
}

export function QuizUpdateForm({ quizId }: QuizUpdateFormProps) {
  const { data, isLoading } = useGetSingleQuiz(quizId, { fields: 'DETAILS' })

  if (isErrorResponse(data?.data)) {
    return <ErrorResponseView error={data.data} />
  }

  return (
    <Container maxWidth="lg">
      {isLoading ? (
        <Stack alignItems="center" justifyContent="center">
          <CircularProgress data-testid="loading-indicator" />
        </Stack>
      ) : data ? (
        <QuizForm existingQuiz={data.data} />
      ) : (
        <p>Not Found</p>
      )}
    </Container>
  )
}
