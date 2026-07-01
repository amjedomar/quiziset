import { fireEvent } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { FormCheckbox } from './form-checkbox'

describe('FormCheckbox', () => {
  it('renders correctly', () => {
    const { asFragment } = renderWithFormContext(<FormCheckbox name="agree" label="I agree" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('updates the form value when clicked', () => {
    const { getByRole, formMethods } = renderWithFormContext(<FormCheckbox name="agree" label="I agree" />)

    fireEvent.click(getByRole('checkbox'))

    expect(formMethods.getValues('agree')).toBe(true)
  })
})
