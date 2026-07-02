import { fireEvent, screen } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { QuestionTypeSelect } from './question-type-select'

describe('QuestionTypeSelect', () => {
  it('correctly renders', () => {
    const { asFragment } = renderWithFormContext(<QuestionTypeSelect formFieldName="questionType" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('updates the form value when a question type is selected', () => {
    const { getByTestId, formMethods } = renderWithFormContext(<QuestionTypeSelect formFieldName="questionType" />)

    fireEvent.mouseDown(getByTestId('select-questionType'))
    fireEvent.click(screen.getByText('Radio'))

    expect(formMethods.getValues('questionType')).toBe('question-radio')
  })
})
