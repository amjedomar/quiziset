import { fireEvent, render } from '@testing-library/react'
import { makeQuizSessionQuestion } from '@/test-utils/mocks'
import { CheckboxQuestion } from './checkbox-question'

const { answers } = makeQuizSessionQuestion('question-checkbox')

describe('CheckboxQuestion', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<CheckboxQuestion answers={answers} value={[]} onChange={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('toggles the answer index in the value when checked/unchecked', () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(<CheckboxQuestion answers={answers} value={[0]} onChange={onChange} />)

    fireEvent.click(getByLabelText('Answer B'))

    expect(onChange).toHaveBeenCalledWith([0, 1])
  })
})
