import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { prefetchGetAllQuizzesQuery } from '@/api-client/quiz'
import Homepage from '@/components/homepage/homepage'
import { makeQueryClient } from '@/utils/query-client'

export default async function Home() {
  const queryClient = makeQueryClient()

  await prefetchGetAllQuizzesQuery(queryClient)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Homepage />
    </HydrationBoundary>
  )
}
