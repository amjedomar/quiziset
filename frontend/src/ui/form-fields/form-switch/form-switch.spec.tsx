import { fireEvent } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { FormSwitch } from './form-switch'

describe('FormSwitch', () => {
  it('renders correctly', () => {
    const { asFragment } = renderWithFormContext(<FormSwitch name="enabled" label="Enabled" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('updates the form value when toggled', () => {
    const { getByRole, formMethods } = renderWithFormContext(<FormSwitch name="enabled" label="Enabled" />)

    fireEvent.click(getByRole('switch'))

    expect(formMethods.getValues('enabled')).toBe(true)
  })
})
