import { render } from '@testing-library/react'
import { ErrorResponseView } from './error-response-view'

describe('ErrorResponseView', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<ErrorResponseView error={{ statusCode: 500, message: 'Something broke' }} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders the error message', () => {
    const { getByText } = render(<ErrorResponseView error={{ statusCode: 400, message: 'Something broke' }} />)

    expect(getByText('Error: Something broke')).toBeInTheDocument()
  })

  it('renders the NotFound page for a 404 error', () => {
    const { getByText } = render(<ErrorResponseView error={{ statusCode: 404, message: '' }} />)

    expect(getByText('Page was not found')).toBeInTheDocument()
  })
})
