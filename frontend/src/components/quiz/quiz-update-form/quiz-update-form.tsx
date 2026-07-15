'use client'

import { CircularProgress, Container, Stack } from '@mui/joy'
import { useGetSingleQuiz } from '@/generated-api-client/quiz'
import { QuizForm } from '@/components/quiz/quiz-form'
import { ErrorResponseView } from '@/components/error-response-view'
import { useRetainedQuery } from '@/hooks/use-retained-query'

interface QuizUpdateFormProps {
  quizId: number
}

export function QuizUpdateForm({ quizId }: QuizUpdateFormProps) {
  const queryResult = useGetSingleQuiz(
    quizId,
    { fields: 'DETAILS' },
    {
      query: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  )
  const { data: quiz, error, isLoading } = useRetainedQuery(queryResult)

  if (error && !quiz) {
    return <ErrorResponseView error={error} />
  }

  return (
    <Container maxWidth="lg">
      {isLoading ? (
        <Stack alignItems="center" justifyContent="center">
          <CircularProgress data-testid="loading-indicator" />
        </Stack>
      ) : quiz ? (
        <QuizForm existingQuiz={quiz} />
      ) : (
        <p>Not Found</p>
      )}
    </Container>
  )
}
