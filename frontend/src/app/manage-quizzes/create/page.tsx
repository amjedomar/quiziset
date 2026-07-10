import type { Metadata } from 'next'
import { Container } from '@mui/joy'
import { QuizForm } from '@/components/quiz/quiz-form'

export const metadata: Metadata = {
  title: 'Create Quiz',
}

export default function CreateQuizPage() {
  return (
    <Container maxWidth="lg">
      <QuizForm />
    </Container>
  )
}
