import { fireEvent, render } from '@testing-library/react'
import { makeQuizSessionQuestion } from '@/test-utils/mocks'
import { CardsQuestion } from './cards-question'

const { answers } = makeQuizSessionQuestion('question-cards')

describe('CardsQuestion', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<CardsQuestion answers={answers} value={[]} onChange={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('toggles the answer index in the value when a card is clicked', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(<CardsQuestion answers={answers} value={[0]} onChange={onChange} />)

    fireEvent.click(getByTestId('question-cards-answer-1'))

    expect(onChange).toHaveBeenCalledWith([0, 1])
  })
})
