import { render } from '@testing-library/react'
import { NotFound } from './not-found'

describe('NotFound', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<NotFound />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders a message with a link that navigates to the explore page', () => {
    const { getByText, getByTestId } = render(<NotFound />)

    expect(getByText('Page was not found')).toBeInTheDocument()
    expect(getByTestId('explore-link')).toHaveAttribute('href', '/')
  })
})
