import { fireEvent, render } from '@testing-library/react'
import { QuizzesList } from './quizzes-list'

const useQuizzesQuery = jest.fn()
jest.mock('@/hooks/use-quizzes-query', () => ({
  useQuizzesQuery: (params: unknown) => useQuizzesQuery(params),
}))

jest.mock('@/components/snackbar', () => ({
  useSnackbar: () => ({ showError: jest.fn(), showSuccess: jest.fn() }),
}))

describe('QuizzesList', () => {
  beforeEach(() => {
    useQuizzesQuery.mockReturnValue({ quizzes: [], totalMatches: 3, totalPages: 3, isLoading: false, error: null })
  })

  it('correctly renders', () => {
    const { asFragment } = render(
      <QuizzesList
        renderHeader={({ totalMatches }) => <p>{totalMatches} matches</p>}
        renderQuizzes={() => <p>the quizzes</p>}
      />,
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('requests the next page when pagination changes', () => {
    const { getByTestId } = render(<QuizzesList renderHeader={() => null} renderQuizzes={() => null} />)

    expect(useQuizzesQuery).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 })) // before click

    fireEvent.click(getByTestId('pagination-next'))

    expect(useQuizzesQuery).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 })) // after click
  })
})
