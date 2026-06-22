import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule, getSchemaPath } from '@nestjs/swagger'
import { AppModule } from '@/app.module'
import { ValidationPipe } from '@nestjs/common'
import { ErrorResponse } from '@/decorators/api-responses-list'

const PORT = 4004
const { FRONTEND_URL } = process.env

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: FRONTEND_URL,
    },
  })

  // Swagger Configuration
  const options = new DocumentBuilder()
    .setTitle('Quiziset API')
    .setDescription('The RESTful APIs Docs for the Quiziset app')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalResponse({
      status: 500,
      description: 'Internal Server Error',
      /**
       * addGlobalResponse doesn't recognize "type" class @ApiResponse property decorators
       * instead use "schema" (and set path only)
       * btw "ErrorResponse" is already registered (since other controllers are using this type)
       */
      schema: { $ref: getSchemaPath(ErrorResponse) },
    })
    .build()

  const document = SwaggerModule.createDocument(app, options, {
    operationIdFactory: (_, methodKey) => methodKey,
  })
  SwaggerModule.setup('/api-docs', app, document)

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true, // required so @Transform decorators works
      whitelist: true, // omits properties that aren't defined in the DTO
      forbidNonWhitelisted: true, // rejects request instead of silently omitting (requires whitelist: true)
    }),
  )

  // Run App
  await app.listen(PORT)

  console.log(`Application is running on http://localhost:${PORT}`)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
