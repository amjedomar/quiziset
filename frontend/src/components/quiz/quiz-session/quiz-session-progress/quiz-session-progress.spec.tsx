import { render } from '@testing-library/react'
import { QuizSessionProgress } from './quiz-session-progress'

describe('QuizSessionProgress', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<QuizSessionProgress currentQuestionIndex={1} questionsCount={4} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('shows the current question number out of the total', () => {
    const { getByText } = render(<QuizSessionProgress currentQuestionIndex={1} questionsCount={4} />)

    expect(getByText('Question 2 of 4')).toBeInTheDocument()
  })
})
