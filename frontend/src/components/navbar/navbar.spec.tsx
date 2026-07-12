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
    useAuth.mockReturnValue({
      currentUser: { name: 'Amjed Omar', email: 'amjed@example.com', imageUrl: null },
    })
  })

  it('correctly renders', () => {
    const { asFragment } = render(<Navbar />)

    expect(asFragment()).toMatchSnapshot()
  })
})
