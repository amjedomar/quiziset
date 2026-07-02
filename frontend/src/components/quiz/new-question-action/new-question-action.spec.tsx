import { fireEvent, render, screen } from '@testing-library/react'
import NewQuestionAction from './new-question-action'

describe('NewQuestionAction', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<NewQuestionAction onCreate={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('calls onCreate with the selected question type', () => {
    const onCreate = jest.fn()
    const { getByTestId, getByText } = render(<NewQuestionAction onCreate={onCreate} />)

    fireEvent.mouseDown(getByTestId('new-question-type-select'))
    fireEvent.click(screen.getByText('Radio'))

    fireEvent.click(getByText('Question'))

    expect(onCreate).toHaveBeenCalledWith('question-radio')
  })
})
