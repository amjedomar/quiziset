import { render } from '@testing-library/react'
import { AuthButtons } from './auth-buttons'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

describe('AuthButtons', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<AuthButtons />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders login and sign up links', () => {
    const { getByTestId } = render(<AuthButtons />)

    expect(getByTestId('login-link')).toHaveAttribute('href', '/login')
    expect(getByTestId('signup-link')).toHaveAttribute('href', '/signup')
  })
})
