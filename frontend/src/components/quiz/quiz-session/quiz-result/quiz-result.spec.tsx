import { render } from '@testing-library/react'
import { makeQuizSessionState } from '@/test-utils/mocks'
import { QuizResult } from './quiz-result'

const state = makeQuizSessionState({ successfulAnswersCount: 3, questionsCount: 5 })

describe('QuizResult', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<QuizResult state={state} quizId={1} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('shows the score and a link back to the quiz overview', () => {
    const { getByText, getByTestId } = render(<QuizResult state={state} quizId={1} />)

    expect(getByText('3 / 5')).toBeInTheDocument()
    expect(getByTestId('back-to-quiz-overview-link')).toHaveAttribute('href', '/quizzes/1/overview')
  })
})
