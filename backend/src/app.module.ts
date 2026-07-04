import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AuthModule } from '@/modules/auth/auth.module'
import { UploadsModule } from '@/modules/uploads/uploads.module'
import { QuizModule } from '@/modules/quiz/quiz.module'
import { QuizSessionModule } from '@/modules/quiz-session/quiz-session.module'
import { QuizFavoriteModule } from '@/modules/quiz-favorite/quiz-favorite.module'
import { QuizAnalyticsModule } from '@/modules/quiz-analytics/quiz-analytics.module'
import { ReviewModule } from '@/modules/review/review.module'
import { UserModule } from '@/modules/user/user.module'
import { AppController } from '@/app.controller'
import { AuthMiddleware } from '@/middlewares/auth'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from '@/prisma.service'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '@/guards/auth'

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
    QuizSessionModule,
    QuizFavoriteModule,
    QuizAnalyticsModule,
    ReviewModule,
    UserModule,
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
