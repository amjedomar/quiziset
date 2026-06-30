import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { prefetchGetAllQuizzesQuery } from '@/generated-api-client/quiz'
import Homepage from '@/components/homepage/homepage'
import { getQuizSortData } from '@/constants/quizzes-list-sort'
import { makeQueryClient } from '@/utils/query-client'
import { GetAllQuizzesParams } from '@/generated-api-client/model'
import { Container } from '@mui/joy'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const queryClient = makeQueryClient()

  const defaultSort = getQuizSortData('most-popular')

  const params: GetAllQuizzesParams = {
    page: 1,
    sortBy: defaultSort.sortBy,
    sortOrder: defaultSort.sortOrder,
  }

  await prefetchGetAllQuizzesQuery(queryClient, params)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container maxWidth="xl">
        <Homepage initialParams={params} />
      </Container>
    </HydrationBoundary>
  )
}
