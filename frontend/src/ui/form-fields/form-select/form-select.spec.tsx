import { fireEvent, screen } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { FormSelect } from './form-select'

describe('FormSelect', () => {
  const formSelect = (
    <FormSelect
      name="color"
      label="Color"
      options={[
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
      ]}
    />
  )

  it('renders correctly', () => {
    const { asFragment } = renderWithFormContext(formSelect)

    expect(asFragment()).toMatchSnapshot()
  })

  it('updates the form value when an option is selected', () => {
    const { formMethods } = renderWithFormContext(formSelect)

    fireEvent.mouseDown(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Red'))

    expect(formMethods.getValues('color')).toBe('red')
  })
})
