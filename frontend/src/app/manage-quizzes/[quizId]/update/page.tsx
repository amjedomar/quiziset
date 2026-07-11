import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { prefetchGetSingleQuizQuery } from '@/generated-api-client/quiz'
import { makeQueryClient } from '@/utils/query-client'
import { QuizUpdateForm } from '@/components/quiz/quiz-update-form'

export const metadata: Metadata = {
  title: 'Edit Quiz',
}

interface QuizUpdatePageProps {
  params: Promise<{ quizId: string }>
}

export default async function QuizUpdatePage({ params }: QuizUpdatePageProps) {
  const { quizId } = await params

  const queryClient = makeQueryClient()

  await prefetchGetSingleQuizQuery(queryClient, Number(quizId), { fields: 'DETAILS' })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuizUpdateForm quizId={Number(quizId)} />
    </HydrationBoundary>
  )
}
