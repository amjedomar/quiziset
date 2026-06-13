import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from '@/app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'

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
    .build()

  const document = SwaggerModule.createDocument(app, options, {
    operationIdFactory: (_, methodKey) => methodKey,
  })
  SwaggerModule.setup('/api-docs', app, document)

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const formatted: Record<string, string[]> = {}

        errors.forEach((error) => {
          formatted[error.property] = Object.values(error.constraints ?? {})
        })

        return new UnprocessableEntityException({ errors: formatted })
      },
    }),
  )

  // Run App
  await app.listen(PORT)

  console.log(`Application is running on http://localhost:${PORT}`)
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
