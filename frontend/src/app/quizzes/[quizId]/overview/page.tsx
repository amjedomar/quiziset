import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { prefetchGetSingleQuizQuery } from '@/generated-api-client/quiz'
import { prefetchGetQuizReviewsQuery } from '@/generated-api-client/review'
import { makeQueryClient } from '@/utils/query-client'
import { QuizOverview } from '@/components/quiz/quiz-overview'

interface QuizOverviewPageProps {
  params: Promise<{ quizId: string }>
}

export default async function QuizOverviewPage({ params }: QuizOverviewPageProps) {
  const { quizId } = await params

  const queryClient = makeQueryClient()

  await Promise.all([
    prefetchGetSingleQuizQuery(queryClient, Number(quizId), { fields: 'OVERVIEW' }),
    prefetchGetQuizReviewsQuery(queryClient, Number(quizId)),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuizOverview quizId={Number(quizId)} />
    </HydrationBoundary>
  )
}
