import { act } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { FormFieldHint } from './form-field-hint'

describe('FormFieldHint', () => {
  beforeEach(() => {
    // see https://github.com/jsdom/jsdom/issues/3429#issuecomment-1936128876
    Element.prototype.animate = jest.fn()
  })

  it('correctly renders the hint and marks it as an error when the field is invalid', () => {
    const { getByText, formMethods, asFragment } = renderWithFormContext(
      <FormFieldHint name="answers">Select the correct answer</FormFieldHint>,
    )

    expect(getByText('Select the correct answer')).toBeInTheDocument()

    act(() => {
      formMethods.setError('answers', { message: 'error' })
    })

    expect(asFragment()).toMatchSnapshot()
  })
})
