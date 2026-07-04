import { makeQuiz } from '@/test-utils/mocks'
import { isErrorOrNoResponse, isErrorResponse } from './is-error-response'

describe('isErrorResponse', () => {
  it('returns true for an error response', () => {
    expect(isErrorResponse({ statusCode: 404, message: 'Not found' })).toBe(true)
  })

  it('returns false for success response', () => {
    expect(isErrorResponse(makeQuiz())).toBe(false)
  })
})

describe('isErrorOrNoResponse', () => {
  it('returns true when there is no response yet', () => {
    expect(isErrorOrNoResponse(undefined)).toBe(true)
  })

  it('returns true for an error response', () => {
    expect(isErrorOrNoResponse({ statusCode: 404, message: 'Not found' })).toBe(true)
  })

  it('returns false for success response', () => {
    expect(isErrorOrNoResponse(makeQuiz())).toBe(false)
  })
})
