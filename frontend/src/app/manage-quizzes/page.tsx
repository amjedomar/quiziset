import type { Metadata } from 'next'
import { Container } from '@mui/joy'
import { ManagedQuizzesList } from '@/components/quiz/managed-quizzes-list'

export const metadata: Metadata = {
  title: 'Manage Quizzes',
}

export default function ManageQuizzesPage() {
  return (
    <Container maxWidth="lg">
      <ManagedQuizzesList />
    </Container>
  )
}
