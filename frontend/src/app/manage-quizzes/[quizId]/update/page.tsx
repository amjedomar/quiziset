import type { Metadata } from 'next'
import { QuizUpdateForm } from '@/components/quiz/quiz-update-form'

export const metadata: Metadata = {
  title: 'Edit Quiz',
}

interface QuizUpdatePageProps {
  params: Promise<{ quizId: string }>
}

export default async function QuizUpdatePage({ params }: QuizUpdatePageProps) {
  const { quizId } = await params

  return <QuizUpdateForm quizId={Number(quizId)} />
}
