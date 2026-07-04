import { QuizController } from '@/modules/quiz/quiz.controller'
import { makeQuizRecord, QUIZ_ID, REQ_USER } from '@/test-utils/mocks'

// the service is mocked so we only test that the controller delegates correctly
describe('QuizController', () => {
  let quizService: any
  let controller: QuizController

  beforeEach(() => {
    quizService = {
      getAll: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }
    controller = new QuizController(quizService)
  })

  it('delegates listing quizzes to the service and returns its result', async () => {
    const query = { page: 1 }
    const page = { data: [makeQuizRecord()], page: 1, pageSize: 12, totalMatches: 1, totalPages: 1 }

    quizService.getAll.mockResolvedValue(page)

    const result = await controller.getAllQuizzes(query, REQ_USER)

    expect(quizService.getAll).toHaveBeenCalledWith(query, REQ_USER.userId)
    expect(result).toBe(page)
  })

  it('delegates getting a single quiz to the service and returns its result', async () => {
    const query = {}
    const quiz = makeQuizRecord()

    quizService.get.mockResolvedValue(quiz)

    const result = await controller.getSingleQuiz(QUIZ_ID, query, REQ_USER)

    expect(quizService.get).toHaveBeenCalledWith(QUIZ_ID, query, REQ_USER.userId)
    expect(result).toBe(quiz)
  })

  it('delegates creating a quiz to the service and returns its result', async () => {
    const dto = { title: 'js basics' }
    const quiz = makeQuizRecord()

    quizService.create.mockResolvedValue(quiz)

    const result = await controller.createQuiz(dto as any, REQ_USER)

    expect(quizService.create).toHaveBeenCalledWith(dto, REQ_USER.userId)
    expect(result).toBe(quiz)
  })

  it('delegates updating a quiz to the service and returns its result', async () => {
    const dto = { title: 'new title' }
    const quiz = makeQuizRecord({ title: 'new title' })

    quizService.update.mockResolvedValue(quiz)

    const result = await controller.updateQuiz(QUIZ_ID, dto, REQ_USER)

    expect(quizService.update).toHaveBeenCalledWith(QUIZ_ID, dto, REQ_USER.userId)
    expect(result).toBe(quiz)
  })

  it('delegates deleting a quiz to the service', async () => {
    quizService.delete.mockResolvedValue(undefined)

    await controller.deleteQuiz(QUIZ_ID, REQ_USER)

    expect(quizService.delete).toHaveBeenCalledWith(QUIZ_ID, REQ_USER.userId)
  })
})
