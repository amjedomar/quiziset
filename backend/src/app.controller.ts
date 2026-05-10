import { Controller, Get, Redirect } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'

@Controller()
@ApiExcludeController()
export class AppController {
  @Get()
  @Redirect('/api-docs', 301)
  redirectToApiDocs() {}
}
