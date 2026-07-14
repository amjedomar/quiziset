import { render } from '@testing-library/react'
import { AuthRedirectAlert } from './auth-redirect-alert'

describe('AuthRedirectAlert', () => {
  beforeEach(() => {
    // see https://github.com/jsdom/jsdom/issues/3429#issuecomment-1936128876
    Element.prototype.animate = jest.fn()
  })

  it('correctly renders', () => {
    const { asFragment } = render(<AuthRedirectAlert action="login" reason="access-protected-page" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('shows the message specific to the action', () => {
    const { getByText, rerender } = render(<AuthRedirectAlert action="login" reason="favorite" />)

    expect(getByText(/Please login so you can favorite quizzes/)).toBeInTheDocument()

    rerender(<AuthRedirectAlert action="signup" reason="favorite" />)

    expect(getByText(/Please sign up so you can favorite quizzes/)).toBeInTheDocument()
  })
})
