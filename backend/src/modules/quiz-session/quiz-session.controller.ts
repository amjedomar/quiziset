import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { QuizSessionService } from '@/modules/quiz-session/quiz-session.service'
import { StartQuizSessionDto } from '@/modules/quiz-session/dto/start-quiz-session.dto'
import { SubmitQuizSessionAnswerDto } from '@/modules/quiz-session/dto/submit-quiz-session-answer.dto'
import { QuizSessionStateEntity } from '@/modules/quiz-session/entities/quiz-session.entity'
import { AuthUser } from '@/decorators/auth-user'
import type { AuthUserData } from '@/decorators/auth-user'
import { ApiResponsesList } from '@/decorators/api-responses-list'

@Controller('quizzes/:quizId/sessions')
export class QuizSessionController {
  constructor(private readonly quizSessionService: QuizSessionService) {}

  @Post()
  // by default for POST Nest.js return "201 Created" status but here "200 OK" makes more sense
  // because if there is an existing on-going quiz session (it is returned instead of creating a new one)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'start a new quiz session (or resume the active one) returns the current question' })
  @ApiResponsesList({ status: 200, type: QuizSessionStateEntity }, 400, 401, 403, 404)
  startQuizSession(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Body() dto: StartQuizSessionDto,
    @AuthUser() user: AuthUserData,
  ): Promise<QuizSessionStateEntity> {
    return this.quizSessionService.startSession(quizId, user.userId, dto)
  }

  @Post('answer')
  // Also here "200 OK" makes more sense than "201 Created"
  // because user answered an existing question (not created a new answer)
  // anyway it is just a personal preference (I think here "200" status is more suitable)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "submit the user's answer for the current question " +
      'and returns the next question (or the result once finished)',
  })
  @ApiResponsesList({ status: 200, type: QuizSessionStateEntity }, 401, 404, 422)
  submitQuizSessionAnswer(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Body() dto: SubmitQuizSessionAnswerDto,
    @AuthUser() user: AuthUserData,
  ): Promise<QuizSessionStateEntity> {
    return this.quizSessionService.submitAnswer(quizId, user.userId, dto)
  }
}
