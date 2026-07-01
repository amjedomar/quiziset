import { fireEvent, render } from '@testing-library/react'
import { SelectEnhanced } from './select-enhanced'

describe('SelectEnhanced', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  const onChange = jest.fn()

  const selectEl = (
    <SelectEnhanced
      value="a"
      onChange={onChange}
      options={[
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
      ]}
    />
  )

  it('renders correctly', async () => {
    const { baseElement } = render(selectEl)

    // since mui/joi attaches the options using react <Portal>
    // we have to use "baseElement" (instead of container/asFragment)
    // so the options is also included in the snapshot file :)
    expect(baseElement).toMatchSnapshot()
  })

  it('calls onChange with the value of the clicked option', () => {
    const { getByRole, getByText } = render(selectEl)

    fireEvent.mouseDown(getByRole('combobox'))
    fireEvent.click(getByText('Option B'))

    expect(onChange).toHaveBeenCalledWith(expect.anything(), 'b')
  })
})
