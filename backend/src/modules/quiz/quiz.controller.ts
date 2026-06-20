import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { QuizService } from '@/modules/quiz/quiz.service'
import { CreateQuizDto } from '@/modules/quiz/dto/create-quiz.dto'
import { UpdateQuizDto } from '@/modules/quiz/dto/update-quiz.dto'
import { GetAllQuizzesQueryDto } from '@/modules/quiz/dto/get-all-quizzes-query.dto'
import { StartQuizSessionDto } from '@/modules/quiz/dto/start-quiz-session.dto'
import { SubmitQuizSessionAnswerDto } from '@/modules/quiz/dto/submit-quiz-session-answer.dto'
import { QuizEntity } from '@/modules/quiz/entities/quiz.entity'
import { QuizSessionStateEntity } from '@/modules/quiz/entities/quiz-session.entity'
import { AuthUser } from '@/decorators/auth-user.decorator'
import type { AuthUserData } from '@/decorators/auth-user.decorator'
import { IsPublic } from '@/decorators/is-public.decorator'
import { ApiResponsesList } from '@/decorators/api-responses-list'

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'get all public quizzes, or own quizzes when managedByMe=true (latter case requires auth)' })
  @ApiResponsesList({ status: 200, type: [QuizEntity] }, 401)
  getAllQuizzes(@Query() query: GetAllQuizzesQueryDto, @AuthUser() user?: AuthUserData): Promise<QuizEntity[]> {
    return this.quizService.getAll(query, user?.userId)
  }

  @Get(':id')
  @IsPublic()
  @ApiOperation({ summary: 'get a quiz by id' })
  @ApiResponsesList({ status: 200, type: QuizEntity }, 403, 404)
  getSingleQuiz(@Param('id', ParseIntPipe) id: number, @AuthUser() user?: AuthUserData): Promise<QuizEntity> {
    return this.quizService.get(id, user?.userId)
  }

  @Post()
  @ApiOperation({ summary: 'create a new quiz' })
  @ApiResponsesList({ status: 201, type: QuizEntity }, 401, 422)
  createQuiz(@Body() dto: CreateQuizDto, @AuthUser() user: AuthUserData): Promise<QuizEntity> {
    return this.quizService.create(dto, user.userId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update a quiz' })
  @ApiResponsesList({ status: 200, type: QuizEntity }, 401, 403, 404, 422)
  updateQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuizDto,
    @AuthUser() user: AuthUserData,
  ): Promise<QuizEntity> {
    return this.quizService.update(id, dto, user.userId)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a quiz' })
  @ApiResponsesList({ status: 200, description: 'quiz deleted' }, 401, 403, 404)
  deleteQuiz(@Param('id', ParseIntPipe) id: number, @AuthUser() user: AuthUserData): Promise<void> {
    return this.quizService.delete(id, user.userId)
  }

  @Post(':quizId/sessions')
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
    return this.quizService.startSession(quizId, user.userId, dto)
  }

  @Post(':quizId/sessions/answer')
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
    return this.quizService.submitAnswer(quizId, user.userId, dto)
  }
}
