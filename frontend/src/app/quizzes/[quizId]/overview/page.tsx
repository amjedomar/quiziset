import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { prefetchGetSingleQuizQuery } from '@/api-client/quiz'
import { makeQueryClient } from '@/utils/query-client'
import QuizOverview from '@/components/quiz/quiz-overview/quiz-overview'

interface QuizOverviewPageProps {
  params: Promise<{ quizId: string }>
}

export default async function QuizOverviewPage({ params }: QuizOverviewPageProps) {
  const { quizId } = await params

  const queryClient = makeQueryClient()

  await prefetchGetSingleQuizQuery(queryClient, Number(quizId), { fields: 'OVERVIEW' })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuizOverview quizId={Number(quizId)} />
    </HydrationBoundary>
  )
}
