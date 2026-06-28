import { keepPreviousData } from '@tanstack/react-query'
import { useGetAllQuizzes } from '@/api-client/quiz'
import { ErrorResponse, GetAllQuizzesParams, QuizEntity } from '@/api-client/model'
import { isErrorResponse } from '@/utils/is-error-response'

interface QuizzesQueryResult {
  quizzes?: QuizEntity[]
  totalMatches: number
  totalPages: number
  isLoading: boolean
  error: ErrorResponse | null
}

export function useQuizzesQuery(params?: GetAllQuizzesParams): QuizzesQueryResult {
  const { data, isLoading } = useGetAllQuizzes(params, { query: { placeholderData: keepPreviousData } })

  const body = data?.data
  const error = body && isErrorResponse(body) ? body : null
  const result = body && !isErrorResponse(body) ? body : undefined

  return {
    quizzes: result?.data,
    totalMatches: result?.totalMatches ?? 0,
    totalPages: result?.totalPages ?? 0,
    isLoading,
    error,
  }
}
