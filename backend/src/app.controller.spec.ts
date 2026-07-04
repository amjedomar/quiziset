import { REDIRECT_METADATA } from '@nestjs/common/constants'
import { AppController } from './app.controller'
import { IS_PUBLIC_METADATA } from '@/decorators/is-public'

describe('AppController', () => {
  it('redirects to the api docs', () => {
    const metadata = Reflect.getMetadata(REDIRECT_METADATA, AppController.prototype.redirectToApiDocs)

    expect(metadata).toEqual({ url: '/api-docs', statusCode: 301 })
  })

  it('is a public route', () => {
    expect(Reflect.getMetadata(IS_PUBLIC_METADATA, AppController.prototype.redirectToApiDocs)).toBe(true)
  })
})
