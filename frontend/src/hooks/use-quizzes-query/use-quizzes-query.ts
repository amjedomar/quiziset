import { useState } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import { useGetAllQuizzes } from '@/generated-api-client/quiz'
import { ErrorResponse, GetAllQuizzesParams, QuizEntity } from '@/generated-api-client/model'
import { useRetainedQuery } from '@/hooks/use-retained-query'

interface QuizzesQueryResult {
  quizzes?: QuizEntity[]
  totalMatches: number | null
  totalPages: number | null
  isLoading: boolean
  isFetching: boolean
  isFetchingChangedQuery: boolean
  error: ErrorResponse | null
}

export function useQuizzesQuery(params?: GetAllQuizzesParams): QuizzesQueryResult {
  const queryResult = useGetAllQuizzes(params, { query: { placeholderData: keepPreviousData } })

  const { isFetching } = queryResult

  const { data: result, error, isLoading } = useRetainedQuery(queryResult)

  const [previousParams, setPreviousParams] = useState(params)
  const [changedQuery, setChangedQuery] = useState(false)

  const queryChanged =
    params?.search !== previousParams?.search ||
    params?.sortBy !== previousParams?.sortBy ||
    params?.sortOrder !== previousParams?.sortOrder

  if (queryChanged) {
    setPreviousParams(params)
    setChangedQuery(true)
  } else if (!isFetching && changedQuery) {
    setChangedQuery(false)
  }

  return {
    quizzes: result?.data,
    totalMatches: result?.totalMatches ?? null,
    totalPages: result?.totalPages ?? null,
    isLoading,
    isFetching,
    isFetchingChangedQuery: isFetching && changedQuery,
    error,
  }
}
