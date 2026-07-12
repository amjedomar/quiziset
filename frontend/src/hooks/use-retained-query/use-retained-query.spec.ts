import { renderHook } from '@testing-library/react'
import { ErrorResponse } from '@/generated-api-client/model'
import { useRetainedQuery } from './use-retained-query'

type Body = { id: number } | ErrorResponse
type QueryResult = { data?: { data: Body }; isLoading: boolean }

const succeedBody = { id: 1 }
const errorBody: ErrorResponse = { statusCode: 500, message: 'something went wrong :(' }

const asResult = (body: Body): QueryResult => ({ data: { data: body }, isLoading: false })

describe('useRetainedQuery', () => {
  it('returns the body and no error on success', () => {
    const { result } = renderHook(() => useRetainedQuery(asResult(succeedBody)))

    expect(result.current).toEqual({ data: succeedBody, error: null, isLoading: false })
  })

  it('returns the error and no data when the initial request fails', () => {
    const { result } = renderHook(() => useRetainedQuery(asResult(errorBody)))

    expect(result.current).toEqual({ data: undefined, error: errorBody, isLoading: false })
  })

  it('keeps the last successful body when a later refetch fails', () => {
    const { result, rerender } = renderHook((props: QueryResult) => useRetainedQuery(props), {
      initialProps: asResult(succeedBody),
    })

    expect(result.current.data).toEqual(succeedBody)

    rerender(asResult(errorBody)) // a later refetch fails

    expect(result.current.data).toEqual(succeedBody) // still the last succeed body
    expect(result.current.error).toEqual(errorBody) // but the last error is returned
  })
})
