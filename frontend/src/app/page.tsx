import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { prefetchGetAllQuizzesQuery } from '@/api-client/quiz'
import Homepage from '@/components/homepage/homepage'

export default async function Home() {
  const queryClient = new QueryClient()

  await prefetchGetAllQuizzesQuery(queryClient)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Homepage />
    </HydrationBoundary>
  )
}
