import { fireEvent, render, waitFor } from '@testing-library/react'
import { makeQuiz, makeQuizQuestion } from '@/test-utils/mocks'
import { QuizForm } from './quiz-form'

const push = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

const createQuiz = jest.fn()
const updateQuiz = jest.fn()
const deleteQuiz = jest.fn()
jest.mock('@/generated-api-client/quiz', () => ({
  useCreateQuiz: () => ({ mutateAsync: createQuiz, isPending: false }),
  useUpdateQuiz: () => ({ mutateAsync: updateQuiz, isPending: false }),
  useDeleteQuiz: () => ({ mutateAsync: deleteQuiz, isPending: false }),
}))

jest.mock('@/generated-api-client/uploads', () => ({
  useUpload: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useDeleteFile: () => ({ mutateAsync: jest.fn() }),
}))

jest.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => children,
}))
jest.mock('@dnd-kit/react/sortable', () => ({
  useSortable: () => ({ ref: null, handleRef: jest.fn(), isDragging: false }),
  isSortableOperation: () => false,
}))

jest.mock('@/components/snackbar', () => ({
  useSnackbar: () => ({ showError: jest.fn(), showSuccess: jest.fn() }),
}))

describe('QuizForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('correctly renders', () => {
    const { asFragment } = render(<QuizForm />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('updates the quiz when submitting the form', async () => {
    const existingQuiz = makeQuiz({ id: 5, questions: [makeQuizQuestion('question-checkbox')] })

    const { getByTestId } = render(<QuizForm existingQuiz={existingQuiz} />)

    updateQuiz.mockResolvedValueOnce({ data: { id: 5 } })

    fireEvent.click(getByTestId('quiz-form-submit-button'))

    // zodResolver omits any fields not defined in "quizSchema" (e.g. id/managerId/manager/...)
    // so only the schema fields are expected in the submitted data
    await waitFor(() => {
      expect(updateQuiz).toHaveBeenCalledWith({
        id: 5,
        data: {
          title: existingQuiz.title,
          description: existingQuiz.description,
          timeDurationInMinutes: existingQuiz.timeDurationInMinutes,
          imageUrl: existingQuiz.imageUrl,
          isPublic: existingQuiz.isPublic,
          isAnalyticsEnabled: existingQuiz.isAnalyticsEnabled,
          questions: existingQuiz.questions,
        },
      })
    })
  })

  it('deletes the quiz after confirming in the modal', async () => {
    const { getByText, getByTestId } = render(<QuizForm existingQuiz={makeQuiz({ id: 5 })} />)

    deleteQuiz.mockResolvedValueOnce({ data: null })

    fireEvent.click(getByText('Delete')) // open the confirm modal
    fireEvent.click(getByTestId('confirm-delete-button')) // confirm the deletion

    await waitFor(() => {
      expect(deleteQuiz).toHaveBeenCalledWith({ id: 5 })
      expect(push).toHaveBeenCalledWith('/manage-quizzes')
    })
  })
})
