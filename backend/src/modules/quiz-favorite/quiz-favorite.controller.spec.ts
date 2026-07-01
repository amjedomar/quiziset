import { QuizFavoriteController } from '@/modules/quiz-favorite/quiz-favorite.controller'
import { QUIZ_ID, REQ_USER } from '@/test-utils/fixtures'

// the service is mocked so we only test that the controller delegates correctly
describe('QuizFavoriteController', () => {
  let quizFavoriteService: any
  let controller: QuizFavoriteController

  beforeEach(() => {
    quizFavoriteService = { add: jest.fn(), remove: jest.fn() }
    controller = new QuizFavoriteController(quizFavoriteService)
  })

  it('delegates adding a favorite to the service', async () => {
    quizFavoriteService.add.mockResolvedValue(undefined)

    await controller.addFavorite(QUIZ_ID, REQ_USER)

    expect(quizFavoriteService.add).toHaveBeenCalledWith(QUIZ_ID, REQ_USER.userId)
  })

  it('delegates removing a favorite to the service', async () => {
    quizFavoriteService.remove.mockResolvedValue(undefined)

    await controller.removeFavorite(QUIZ_ID, REQ_USER)

    expect(quizFavoriteService.remove).toHaveBeenCalledWith(QUIZ_ID, REQ_USER.userId)
  })
})
