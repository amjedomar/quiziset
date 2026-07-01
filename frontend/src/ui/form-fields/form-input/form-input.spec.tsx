import { fireEvent } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { FormInput } from './form-input'

describe('FormInput', () => {
  it('renders correctly', () => {
    const { asFragment } = renderWithFormContext(<FormInput name="title" label="Title" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('updates the form value when user types in it', () => {
    const { getByRole, formMethods } = renderWithFormContext(<FormInput name="title" label="Title" />)

    fireEvent.change(getByRole('textbox'), { target: { value: 'My quiz' } })

    expect(formMethods.getValues('title')).toBe('My quiz')
  })
})
