import { render } from '@testing-library/react'
import ManageQuizzesPage from './page'

const ManagedQuizzesList = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="managed-quizzes-list" />)
jest.mock('@/components/quiz/managed-quizzes-list', () => ({
  ManagedQuizzesList: (props: unknown) => ManagedQuizzesList(props),
}))

describe('ManageQuizzesPage', () => {
  it('renders the managed quizzes list', () => {
    const { getByTestId } = render(<ManageQuizzesPage />)

    expect(getByTestId('managed-quizzes-list')).toBeInTheDocument()
  })
})
