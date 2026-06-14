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
