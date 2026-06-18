import { ErrorResponse } from '@/api-client/model'

export function isErrorResponse(value: unknown): value is ErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'statusCode' in value &&
    typeof value.statusCode === 'number' &&
    (value.statusCode >= 400 || value.statusCode <= 599)
  )
}

export function isErrorOrNoResponse(value: unknown): value is ErrorResponse | undefined {
  if (typeof value === 'undefined') {
    return true
  }

  return isErrorResponse(value)
}
