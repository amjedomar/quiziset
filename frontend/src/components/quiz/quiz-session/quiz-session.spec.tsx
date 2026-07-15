import { fireEvent, render, waitFor } from '@testing-library/react'
import { makeQuizSessionQuestion, makeQuizSessionState } from '@/test-utils/mocks'
import { QuizSession } from './quiz-session'

const push = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

const startSession = jest.fn()
const submitAnswer = jest.fn()
jest.mock('@/generated-api-client/quiz-session', () => ({
  useStartQuizSession: () => ({ mutateAsync: startSession }),
  useSubmitQuizSessionAnswer: () => ({ mutateAsync: submitAnswer, isPending: false }),
}))

jest.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => children,
}))
jest.mock('@dnd-kit/react/sortable', () => ({
  useSortable: () => ({ ref: null, handleRef: jest.fn(), isDragging: false }),
}))
jest.mock('@dnd-kit/helpers', () => ({
  move: jest.fn(),
}))

jest.mock('@/components/snackbar', () => ({
  useSnackbar: () => ({ showError: jest.fn() }),
}))

describe('QuizSession', () => {
  const firstQuestionTitle = 'What is the highest mountain in the world?'
  const secondQuestionTitle = 'What is the capital of Malaysia?'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('correctly renders', async () => {
    startSession.mockResolvedValue({
      status: 200,
      data: makeQuizSessionState({
        currentQuestion: makeQuizSessionQuestion('question-checkbox', { title: firstQuestionTitle }),
      }),
    })

    const { asFragment, findByTestId } = render(<QuizSession quizId={1} />)

    await findByTestId('quiz-question-title') // wait for the question to render

    expect(asFragment()).toMatchSnapshot()
  })

  it('starts the session then submits the selected answer to move to the next question', async () => {
    startSession.mockResolvedValue({
      status: 200,
      data: makeQuizSessionState({
        questionsCount: 2,
        currentQuestionIndex: 0,
        currentQuestion: makeQuizSessionQuestion('question-checkbox', { title: firstQuestionTitle }),
      }),
    })

    const { findByLabelText, getByText, getByTestId } = render(<QuizSession quizId={1} />)

    await waitFor(() => {
      expect(startSession).toHaveBeenCalledWith({ quizId: 1, data: { isAnalyticsShared: undefined } })
    })

    expect(getByTestId('quiz-question-title')).toHaveTextContent(firstQuestionTitle)

    fireEvent.click(await findByLabelText('Answer A')) // confirm that the answer is rendered

    submitAnswer.mockResolvedValue({
      status: 200,
      data: makeQuizSessionState({
        questionsCount: 2,
        currentQuestionIndex: 1,
        currentQuestion: makeQuizSessionQuestion('question-radio', { title: secondQuestionTitle }),
      }),
    })

    fireEvent.click(getByText('Next Question')) // proceed to next question

    expect(submitAnswer).toHaveBeenCalledWith({ quizId: 1, data: { questionIndex: 0, answerIndexes: [0] } })

    await waitFor(() => {
      expect(getByText('Question 2 of 2')).toBeInTheDocument() // check if progress text is updated
      expect(getByTestId('quiz-question-title')).toHaveTextContent(secondQuestionTitle)
    })
  })
})
