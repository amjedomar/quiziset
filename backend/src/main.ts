import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from '@/app.module'
import { ValidationPipe } from '@nestjs/common'

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
    }),
  )

  // Run App
  await app.listen(PORT)

  console.log(`Application is running on http://localhost:${PORT}`)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
