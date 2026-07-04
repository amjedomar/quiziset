import { renderHook } from '@testing-library/react'
import { makeQuiz } from '@/test-utils/mocks'
import { useQuizzesQuery } from './use-quizzes-query'

const useGetAllQuizzes = jest.fn()
jest.mock('@/generated-api-client/quiz', () => ({
  useGetAllQuizzes: (...args: unknown[]) => useGetAllQuizzes(...args),
}))

describe('useQuizzesQuery', () => {
  it('returns the quizzes and pagination data', () => {
    useGetAllQuizzes.mockReturnValue({
      data: { data: { data: [makeQuiz()], totalMatches: 1, totalPages: 1 } },
      isLoading: false,
    })

    const { result } = renderHook(() => useQuizzesQuery())

    expect(result.current).toEqual({
      quizzes: [makeQuiz()],
      totalMatches: 1,
      totalPages: 1,
      isLoading: false,
      error: null,
    })
  })

  it('returns the error when the request fails', () => {
    useGetAllQuizzes.mockReturnValue({
      data: { data: { statusCode: 400, message: 'something went wrong' } },
      isLoading: false,
    })

    const { result } = renderHook(() => useQuizzesQuery())

    expect(result.current.error).toEqual({ statusCode: 400, message: 'something went wrong' })
  })
})
