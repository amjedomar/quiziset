import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { QuizService } from '@/modules/quiz/quiz.service'
import { CreateQuizDto } from '@/modules/quiz/dto/create-quiz.dto'
import { UpdateQuizDto } from '@/modules/quiz/dto/update-quiz.dto'
import { GetAllQuizzesQueryDto } from '@/modules/quiz/dto/get-all-quizzes-query.dto'
import { QuizEntity } from '@/modules/quiz/entities/quiz.entity'
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
  getAll(@Query() query: GetAllQuizzesQueryDto, @AuthUser() user?: AuthUserData): Promise<QuizEntity[]> {
    return this.quizService.getAll(query, user?.userId)
  }

  @Get(':id')
  @IsPublic()
  @ApiOperation({ summary: 'get a quiz by id' })
  @ApiResponsesList({ status: 200, type: QuizEntity }, 403, 404)
  get(@Param('id', ParseIntPipe) id: number, @AuthUser() user?: AuthUserData): Promise<QuizEntity> {
    return this.quizService.get(id, user?.userId)
  }

  @Post()
  @ApiOperation({ summary: 'create a new quiz' })
  @ApiResponsesList({ status: 201, type: QuizEntity }, 401, 422)
  create(@Body() dto: CreateQuizDto, @AuthUser() user: AuthUserData): Promise<QuizEntity> {
    return this.quizService.create(dto, user.userId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update a quiz' })
  @ApiResponsesList({ status: 200, type: QuizEntity }, 401, 403, 404, 422)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuizDto,
    @AuthUser() user: AuthUserData,
  ): Promise<QuizEntity> {
    return this.quizService.update(id, dto, user.userId)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a quiz' })
  @ApiResponsesList({ status: 200, description: 'quiz deleted' }, 401, 403, 404)
  delete(@Param('id', ParseIntPipe) id: number, @AuthUser() user: AuthUserData): Promise<void> {
    return this.quizService.delete(id, user.userId)
  }
}
