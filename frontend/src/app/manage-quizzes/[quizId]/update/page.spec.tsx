import { render } from '@testing-library/react'
import QuizUpdatePage from './page'

const QuizUpdateForm = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="quiz-update-form" />)
jest.mock('@/components/quiz/quiz-update-form', () => ({
  QuizUpdateForm: (props: unknown) => QuizUpdateForm(props),
}))

describe('QuizUpdatePage', () => {
  it('renders the quiz update form for the quiz (matching the route quizId param)', async () => {
    const { getByTestId } = render(await QuizUpdatePage({ params: Promise.resolve({ quizId: '5' }) }))

    expect(getByTestId('quiz-update-form')).toBeInTheDocument()
    expect(QuizUpdateForm).toHaveBeenCalledWith({ quizId: 5 })
  })
})
