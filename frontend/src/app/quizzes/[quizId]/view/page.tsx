'use client'

import { Container } from '@mui/joy'
import { useParams } from 'next/navigation'
import { useGetSingleQuiz } from '@/api-client/quiz'
import { isErrorOrNoResponse } from '@/utils/is-error-response'
import { ErrorResponseView } from '@/components/error-response-view'
import { Loading } from '@/components/loading'

export default function QuizViewPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const { data, isLoading } = useGetSingleQuiz(Number(quizId))

  const quiz = data?.data

  if (isLoading) {
    return <Loading />
  }

  if (isErrorOrNoResponse(quiz)) {
    return <ErrorResponseView error={quiz} />
  }

  return <Container maxWidth="lg">Quiz Title: {quiz.title}</Container>
}
