import { render } from '@testing-library/react'
import { makeQuiz } from '@/test-utils/mocks'
import { QuizUpdateForm } from './quiz-update-form'

jest.mock('@/constants/api-url', () => ({
  NEXT_PUBLIC_API_BASE_URL: 'http://mock-backend',
}))

const useGetSingleQuiz = jest.fn()
jest.mock('@/generated-api-client/quiz', () => ({
  useGetSingleQuiz: (...args: unknown[]) => useGetSingleQuiz(...args),
  useCreateQuiz: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useUpdateQuiz: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useDeleteQuiz: () => ({ mutateAsync: jest.fn(), isPending: false }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
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

describe('QuizUpdateForm', () => {
  it('correctly renders', () => {
    useGetSingleQuiz.mockReturnValue({ data: { data: makeQuiz() }, isLoading: false })

    const { asFragment } = render(<QuizUpdateForm quizId={5} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('fetches and renders the quiz form in update mode', () => {
    useGetSingleQuiz.mockReturnValue({ data: { data: makeQuiz() }, isLoading: false })

    const { getByTestId } = render(<QuizUpdateForm quizId={5} />)

    expect(useGetSingleQuiz).toHaveBeenCalledWith(5, { fields: 'DETAILS' })
    expect(getByTestId('quiz-form-submit-button')).toHaveTextContent('Update Quiz')
  })

  it('shows a loading indicator while fetching', () => {
    useGetSingleQuiz.mockReturnValue({ data: undefined, isLoading: true })

    const { getByTestId } = render(<QuizUpdateForm quizId={5} />)

    expect(getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('shows an error message when the request fails', () => {
    useGetSingleQuiz.mockReturnValue({
      data: { data: { statusCode: 404, message: 'Quiz not found' } },
      isLoading: false,
    })

    const { getByText } = render(<QuizUpdateForm quizId={5} />)

    expect(getByText('Page was not found')).toBeInTheDocument()
  })
})
