import { act } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { FormFieldError } from './form-field-error'

describe('FormFieldError', () => {
  it('displays the error message for the given field', () => {
    const { getByText, formMethods, asFragment } = renderWithFormContext(<FormFieldError name="answers" />)

    const errorMessage = 'At least one answer must be correct'

    act(() => {
      formMethods.setError('answers', { message: errorMessage })
    })

    expect(getByText(errorMessage)).toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })
})
