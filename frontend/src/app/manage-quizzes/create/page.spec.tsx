import { render } from '@testing-library/react'
import CreateQuizPage from './page'

const QuizForm = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="quiz-form" />)
jest.mock('@/components/quiz/quiz-form', () => ({
  QuizForm: (props: unknown) => QuizForm(props),
}))

describe('CreateQuizPage', () => {
  it('renders the quiz form', () => {
    const { getByTestId } = render(<CreateQuizPage />)

    expect(getByTestId('quiz-form')).toBeInTheDocument()
  })
})
