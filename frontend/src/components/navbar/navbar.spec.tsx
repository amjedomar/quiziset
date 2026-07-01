import { render } from '@testing-library/react'
import { Navbar } from './navbar'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

const useAuth = jest.fn()
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => useAuth(),
}))

describe('Navbar', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ isLoggedIn: false })
  })

  it('correctly renders', () => {
    const { asFragment } = render(<Navbar />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders the auth buttons when logged out', () => {
    const { getByTestId } = render(<Navbar />)

    expect(getByTestId('login-link')).toHaveAttribute('href', '/login')
    expect(getByTestId('signup-link')).toHaveAttribute('href', '/signup')
  })

  it('renders the profile menu when logged in', () => {
    useAuth.mockReturnValue({
      isLoggedIn: true,
      currentUser: { name: 'Amjed Omar', email: 'amjed@example.com', imageUrl: null },
    })

    const { getByTestId, queryByTestId } = render(<Navbar />)

    expect(getByTestId('profile-menu-button')).toHaveTextContent('AO')
    expect(queryByTestId('login-link')).not.toBeInTheDocument()
    expect(queryByTestId('signup-link')).not.toBeInTheDocument()
  })
})
