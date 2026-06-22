'use client'

import { Button, Container } from '@mui/joy'
import { useParams } from 'next/navigation'
import { useGetSingleQuiz } from '@/api-client/quiz'
import { isErrorOrNoResponse } from '@/utils/is-error-response'
import { ErrorResponseView } from '@/components/error-response-view'
import { Loading } from '@/components/loading'
import NextLink from 'next/link'
import StartIcon from '@mui/icons-material/PlayCircleFilledWhite'

export default function QuizOverviewPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const { data, isLoading } = useGetSingleQuiz(Number(quizId), { fields: 'OVERVIEW' })

  const quiz = data?.data

  if (isLoading) {
    return <Loading />
  }

  if (isErrorOrNoResponse(quiz)) {
    return <ErrorResponseView error={quiz} />
  }

  return (
    <Container maxWidth="lg">
      Quiz Title: {quiz.title}
      <Button component={NextLink} href={`/quizzes/${quiz.id}/session`} startDecorator={<StartIcon />} size="lg">
        Start
      </Button>
    </Container>
  )
}
