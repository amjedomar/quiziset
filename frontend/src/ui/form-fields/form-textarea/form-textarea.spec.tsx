import { fireEvent } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { FormTextarea } from './form-textarea'

describe('FormTextarea', () => {
  it('renders correctly', () => {
    const { asFragment } = renderWithFormContext(<FormTextarea name="description" label="Description" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('updates the form value when typed into', () => {
    const { getByTestId, formMethods } = renderWithFormContext(<FormTextarea name="description" label="Description" />)

    fireEvent.change(getByTestId('textarea-description'), { target: { value: 'A description' } })

    expect(formMethods.getValues('description')).toBe('A description')
  })
})
