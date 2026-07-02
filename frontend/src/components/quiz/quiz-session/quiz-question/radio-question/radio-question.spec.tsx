import { fireEvent, render } from '@testing-library/react'
import { makeQuizSessionQuestion } from '@/test-utils/mocks'
import { RadioQuestion } from './radio-question'

const { answers } = makeQuizSessionQuestion('question-radio')

describe('RadioQuestion', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<RadioQuestion answers={answers} value={[]} onChange={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('calls onChange with the selected answer index', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(<RadioQuestion answers={answers} value={[]} onChange={onChange} />)

    fireEvent.click(getByLabelText('Answer B'))

    expect(onChange).toHaveBeenCalledWith([1])
  })
})
