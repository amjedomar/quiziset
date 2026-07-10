import type { Metadata } from 'next'
import { Container } from '@mui/joy'
import { QuizSession } from '@/components/quiz/quiz-session'

export const metadata: Metadata = {
  title: 'Quiz Session',
}

export default async function QuizSessionPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params

  return (
    <Container maxWidth="md">
      <QuizSession quizId={Number(quizId)} />
    </Container>
  )
}
