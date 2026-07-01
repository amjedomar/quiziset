import { fireEvent } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { FormRadio } from './form-radio'

describe('FormRadio', () => {
  it('renders correctly', () => {
    const { asFragment } = renderWithFormContext(<FormRadio name="answer" label="Option A" onChange={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('calls onChange when clicked', () => {
    const onChange = jest.fn()

    const { getByRole } = renderWithFormContext(<FormRadio name="answer" label="Option A" onChange={onChange} />)

    fireEvent.click(getByRole('radio'))

    expect(onChange).toHaveBeenCalled()
  })
})
