import { fireEvent, render } from '@testing-library/react'
import { ProfileDesktopMenu } from './profile-desktop-menu'

const logout = jest.fn()
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ currentUser: { name: 'Amjed Omar', email: 'amjed@example.com', imageUrl: null }, logout }),
}))

describe('ProfileDesktopMenu', () => {
  it('correctly renders', () => {
    // use `baseElement` instead of container/asFragment (because we need to capture
    // the content of the <Portal> attached to document.body)
    const { baseElement } = render(<ProfileDesktopMenu />)

    expect(baseElement).toMatchSnapshot()
  })

  it('calls logout when the logout menu item is clicked', () => {
    const { getByTestId, getByText } = render(<ProfileDesktopMenu />)

    fireEvent.click(getByTestId('profile-menu-button')) // open menu
    fireEvent.click(getByText('Logout')) // click logout

    expect(logout).toHaveBeenCalled()
  })
})
