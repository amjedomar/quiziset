// api-responses-list.decorator.ts
import { applyDecorators } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiResponseNoStatusOptions } from '@nestjs/swagger'

const DEFAULT_RESPONSE_DESCRIPTIONS: Record<number, string> = {
  200: 'OK',
  201: 'Created',

  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  422: 'Unprocessable Entity (Validation Failed)',

  500: 'Internal Server Error',
}

type ApiResponsesListItem =
  | number
  | ({
      status: number
    } & ApiResponseNoStatusOptions)

/**
 * use this decorator to list multiple response in clean way:
 * - Code is cleaner (more compact) when all responses are listed in this single decorator
 * - It has predefined messages for most-common status codes (e.g. "Forbidden" for 403)
 * - It automatically apply "ApiBearerAuth" decorator when 401 or 403 status code is presented
 */
export function ApiResponsesList(...responses: ApiResponsesListItem[]): MethodDecorator & ClassDecorator {
  const decorators: (MethodDecorator & ClassDecorator)[] = responses.map((response) => {
    const options =
      typeof response === 'number'
        ? {
            status: response,
            description: DEFAULT_RESPONSE_DESCRIPTIONS[response],
          }
        : {
            ...response,
            description: response.description ?? DEFAULT_RESPONSE_DESCRIPTIONS[response.status],
          }

    return ApiResponse(options)
  })

  const isAuthInvolved = responses.some((response) => {
    const statusCode = typeof response === 'number' ? response : response.status
    return statusCode === 401 || statusCode === 403
  })

  if (isAuthInvolved) {
    // ApiBearerAuth instructs Swagger Docs to send "Authorization" header to the request
    decorators.push(ApiBearerAuth())
  }

  return applyDecorators(...decorators)
}
