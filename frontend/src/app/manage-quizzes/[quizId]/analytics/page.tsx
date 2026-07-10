import type { Metadata } from 'next'
import { Container } from '@mui/joy'
import { QuizAnalytics } from '@/components/quiz/quiz-analytics'

export const metadata: Metadata = {
  title: 'Quiz Analytics',
}

interface QuizAnalyticsPageProps {
  params: Promise<{ quizId: string }>
}

export default async function QuizAnalyticsPage({ params }: QuizAnalyticsPageProps) {
  const { quizId } = await params

  return (
    <Container maxWidth="lg">
      <QuizAnalytics quizId={Number(quizId)} />
    </Container>
  )
}
