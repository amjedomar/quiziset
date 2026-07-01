import { fireEvent, render } from '@testing-library/react'
import { StarsRating } from './stars-rating'

describe('StarsRating', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<StarsRating value={3} size="md" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('calls onChange with the value of the clicked star', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(<StarsRating value={0} size="md" onChange={onChange} />)

    fireEvent.click(getByTestId('rating-star-3'))

    expect(onChange).toHaveBeenCalledWith(3)
  })
})
