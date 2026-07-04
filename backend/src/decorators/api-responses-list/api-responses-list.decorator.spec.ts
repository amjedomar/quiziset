import { DECORATORS } from '@nestjs/swagger/dist/constants'
import { ApiResponsesList, ErrorResponse } from './api-responses-list.decorator'

class TestController {
  @ApiResponsesList(200, 404, 500)
  handlerWithoutAuth() {}

  @ApiResponsesList(200, 401, 403)
  handlerWithAuth() {}

  @ApiResponsesList({ status: 400, description: 'Custom message' })
  handlerWithCustomDescription() {}
}

describe('ApiResponsesList', () => {
  it('registers each response status with its default description', () => {
    const responses = Reflect.getMetadata(DECORATORS.API_RESPONSE, TestController.prototype.handlerWithoutAuth)

    expect(responses[200].description).toBe('OK')
    expect(responses[404].description).toBe('Not Found')
  })

  it('sets the error response type for status codes 4xx and 5xx', () => {
    const responses = Reflect.getMetadata(DECORATORS.API_RESPONSE, TestController.prototype.handlerWithoutAuth)

    expect(responses[404].type).toBe(ErrorResponse)
    expect(responses[500].type).toBe(ErrorResponse)
    expect(responses[200].type).toBeUndefined()
  })

  it('applies ApiBearerAuth when a 401 or 403 response is listed', () => {
    expect(Reflect.getMetadata(DECORATORS.API_SECURITY, TestController.prototype.handlerWithAuth)).toEqual([
      { bearer: [] },
    ])
    expect(Reflect.getMetadata(DECORATORS.API_SECURITY, TestController.prototype.handlerWithoutAuth)).toBeUndefined()
  })

  it('uses a custom description when provided', () => {
    const responses = Reflect.getMetadata(
      DECORATORS.API_RESPONSE,
      TestController.prototype.handlerWithCustomDescription,
    )

    expect(responses[400].description).toBe('Custom message')
  })
})
