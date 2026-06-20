'use client'

import { Container } from '@mui/joy'
import { useParams } from 'next/navigation'
import { QuizSession } from '@/components/quiz/quiz-session'

export default function QuizSessionPage() {
  const { quizId } = useParams<{ quizId: string }>()

  return (
    <Container maxWidth="md">
      <QuizSession quizId={Number(quizId)} />
    </Container>
  )
}
