import { Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { QuizFavoriteService } from '@/modules/quiz-favorite/quiz-favorite.service'
import { AuthUser } from '@/decorators/auth-user.decorator'
import type { AuthUserData } from '@/decorators/auth-user.decorator'
import { ApiResponsesList } from '@/decorators/api-responses-list'

/**
 * it is intentionally tagged under the same "Quiz" Swagger tag as QuizController
 * so on frontend Orval generate the add/remove favorite hooks in the same "quiz.ts" file
 * this is a workaround to prevent "Cannot find name 'getGetAllQuizzesQueryKey' .ts(2304)" bug
 */
@ApiTags('Quiz')
@Controller('quizzes/:quizId/favorite')
export class QuizFavoriteController {
  constructor(private readonly quizFavoriteService: QuizFavoriteService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'add the quiz to the current user favorites' })
  @ApiResponsesList({ status: 204, description: 'quiz favorited' }, 401, 403, 404)
  addFavorite(@Param('quizId', ParseIntPipe) quizId: number, @AuthUser() user: AuthUserData): Promise<void> {
    return this.quizFavoriteService.add(quizId, user.userId)
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'remove the quiz from the current user favorites' })
  @ApiResponsesList({ status: 204, description: 'quiz unfavorited' }, 401)
  removeFavorite(@Param('quizId', ParseIntPipe) quizId: number, @AuthUser() user: AuthUserData): Promise<void> {
    return this.quizFavoriteService.remove(quizId, user.userId)
  }
}
