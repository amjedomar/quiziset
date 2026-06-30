'use client'

import { CircularProgress, Container, Stack } from '@mui/joy'
import { useParams } from 'next/navigation'
import { useGetSingleQuiz } from '@/generated-api-client/quiz'
import { QuizForm } from '@/components/quiz/quiz-form'
import { isErrorResponse } from '@/utils/is-error-response'

export default function QuizUpdatePage() {
  const { quizId } = useParams<{ quizId: string }>()
  const { data, isLoading } = useGetSingleQuiz(Number(quizId), { fields: 'DETAILS' })

  if (isErrorResponse(data?.data)) {
    return <p>Error {data.data.message}</p>
  }

  return (
    <Container maxWidth="lg">
      {isLoading ? (
        <Stack alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : data ? (
        <QuizForm existingQuiz={data.data} />
      ) : (
        <p>Not Found</p>
      )}
    </Container>
  )
}
