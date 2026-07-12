import { keepPreviousData } from '@tanstack/react-query'
import { useGetAllQuizzes } from '@/generated-api-client/quiz'
import { ErrorResponse, GetAllQuizzesParams, QuizEntity } from '@/generated-api-client/model'
import { useRetainedQuery } from '@/hooks/use-retained-query'

interface QuizzesQueryResult {
  quizzes?: QuizEntity[]
  totalMatches: number
  totalPages: number
  isLoading: boolean
  error: ErrorResponse | null
}

export function useQuizzesQuery(params?: GetAllQuizzesParams): QuizzesQueryResult {
  const queryResult = useGetAllQuizzes(params, { query: { placeholderData: keepPreviousData } })

  const { data: result, error, isLoading } = useRetainedQuery(queryResult)

  return {
    quizzes: result?.data,
    totalMatches: result?.totalMatches ?? 0,
    totalPages: result?.totalPages ?? 0,
    isLoading,
    error,
  }
}
