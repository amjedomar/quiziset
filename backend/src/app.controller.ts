import { Controller, Get, Redirect } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { IsPublic } from '@/decorators/is-public'

@Controller()
@ApiExcludeController()
export class AppController {
  @Get()
  @IsPublic()
  @Redirect('/api-docs', 301)
  redirectToApiDocs() {}
}
