import { Container } from '@mui/joy'
import { ManagedQuizzesList } from '@/components/quiz/managed-quizzes-list'

export default function ManageQuizzesPage() {
  return (
    <Container maxWidth="lg">
      <ManagedQuizzesList />
    </Container>
  )
}
