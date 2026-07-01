import { render } from '@testing-library/react'
import { NavbarMobileDrawer } from './navbar-mobile-drawer'

const useAuth = jest.fn()
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => useAuth(),
}))

describe('NavbarMobileDrawer', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ isLoggedIn: false })
  })

  it('correctly renders', () => {
    // use `baseElement` instead of container/asFragment (because we need to capture
    // the content of the <Portal> attached to document.body)
    const { baseElement } = render(<NavbarMobileDrawer open onClose={jest.fn()} />)

    expect(baseElement).toMatchSnapshot()
  })

  it('renders the auth buttons when logged out', () => {
    const { getByTestId } = render(<NavbarMobileDrawer open onClose={jest.fn()} />)

    expect(getByTestId('mobile-login-link')).toHaveAttribute('href', '/login')
    expect(getByTestId('mobile-signup-link')).toHaveAttribute('href', '/signup')
  })

  it('renders the user profile and logout button when logged in', () => {
    useAuth.mockReturnValue({
      isLoggedIn: true,
      currentUser: { name: 'Amjed Omar', email: 'amjed@example.com', imageUrl: null },
      logout: jest.fn(),
    })

    const { getByTestId, getByText, queryByTestId } = render(<NavbarMobileDrawer open onClose={jest.fn()} />)

    expect(getByText('Amjed Omar')).toBeInTheDocument()
    expect(getByText('amjed@example.com')).toBeInTheDocument()
    expect(getByTestId('mobile-nav-link/profile')).toHaveAttribute('href', '/profile')
    expect(getByTestId('mobile-logout-button')).toBeInTheDocument()
    expect(queryByTestId('mobile-login-link')).not.toBeInTheDocument()
    expect(queryByTestId('mobile-signup-link')).not.toBeInTheDocument()
  })
})
