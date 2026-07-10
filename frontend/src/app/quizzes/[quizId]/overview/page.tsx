import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getSingleQuiz, prefetchGetSingleQuizQuery } from '@/generated-api-client/quiz'
import { prefetchGetQuizReviewsQuery } from '@/generated-api-client/review'
import { makeQueryClient } from '@/utils/query-client'
import { isErrorResponse } from '@/utils/is-error-response'
import { NEXT_PUBLIC_API_BASE_URL } from '@/constants/api-url'
import { QuizOverview } from '@/components/quiz/quiz-overview'

interface QuizOverviewPageProps {
  params: Promise<{ quizId: string }>
}

export async function generateMetadata({ params }: QuizOverviewPageProps): Promise<Metadata> {
  const { quizId } = await params

  const { data: quiz } = await getSingleQuiz(Number(quizId), { fields: 'OVERVIEW' })

  if (isErrorResponse(quiz)) {
    // the quiz may be deleted or private
    return {
      title: 'Quiz',
      robots: { index: false, follow: false },
    }
  }

  const { title, description } = quiz

  const images = quiz.imageUrl ? [`${NEXT_PUBLIC_API_BASE_URL}${quiz.imageUrl}`] : undefined

  return {
    title,
    description,
    openGraph: {
      images,
    },
    twitter: {
      images,
    },
    robots: quiz.isPublic ? undefined : { index: false, follow: false },
  }
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
