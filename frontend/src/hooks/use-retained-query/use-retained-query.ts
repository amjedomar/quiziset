import { useState } from 'react'
import { ErrorResponse } from '@/generated-api-client/model'
import { isErrorResponse } from '@/utils/is-error-response'

interface OrvalQueryResult<TResponse extends { data: unknown }> {
  data?: TResponse
  isLoading: boolean
}

interface RetainedQueryResult<TSuccessBody> {
  data?: TSuccessBody
  error: ErrorResponse | null
  isLoading: boolean
}

/**
 * keeps the last successful response body so a failed re-fetch (offline or backend api down)
 * doesn't erase the page content
 *
 * However, for the error --> the last error is always returned so it can be handled
 */
export function useRetainedQuery<TResponse extends { data: unknown }>(
  queryResult: OrvalQueryResult<TResponse>,
): RetainedQueryResult<Exclude<TResponse['data'], ErrorResponse>> {
  type SuccessBody = Exclude<TResponse['data'], ErrorResponse>

  const [lastSucceedBody, setLastSucceedBody] = useState<SuccessBody | undefined>(undefined)

  const body = queryResult.data?.data

  const error = body !== undefined && isErrorResponse(body) ? body : null
  const freshBody = body !== undefined && !isErrorResponse(body) ? (body as SuccessBody) : undefined

  if (freshBody !== undefined && freshBody !== lastSucceedBody) {
    setLastSucceedBody(freshBody)
  }

  return {
    data: freshBody ?? lastSucceedBody,
    error,
    isLoading: queryResult.isLoading,
  }
}
