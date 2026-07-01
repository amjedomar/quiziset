import { act } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { FormFieldCore } from './form-field-core'

describe('FormFieldCore', () => {
  it('renders correctly', () => {
    const { asFragment } = renderWithFormContext(
      <FormFieldCore name="title" label="Title" defaultValue="" renderField={() => <input />} />,
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders the field error message', () => {
    const { getByText, formMethods } = renderWithFormContext(
      <FormFieldCore name="title" label="Title" defaultValue="" renderField={() => <input />} />,
    )

    act(() => {
      formMethods.setError('title', { message: 'Title is required' })
    })

    expect(getByText('Title is required')).toBeInTheDocument()
  })
})
