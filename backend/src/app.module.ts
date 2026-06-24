import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AuthModule } from '@/modules/auth/auth.module'
import { UploadsModule } from '@/modules/uploads/uploads.module'
import { QuizModule } from '@/modules/quiz/quiz.module'
import { ReviewModule } from '@/modules/review/review.module'
import { AppController } from '@/app.controller'
import { AuthMiddleware } from '@/middlewares/auth.middleware'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from '@/prisma.service'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '@/guards/auth.guard'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    AuthModule,
    UploadsModule,
    QuizModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    {
      /**
       * provide guard globally (see https://docs.nestjs.com/guards)
       *
       * this way authentication will be enabled by default for every request
       * except, if request is marked public explicity via @IsPublic
       */
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
