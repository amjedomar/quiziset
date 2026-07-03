import { render } from '@testing-library/react'
import LoginPage from './page'

const LoginForm = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="login-form" />)
jest.mock('@/components/auth/login-form', () => ({
  LoginForm: (props: unknown) => LoginForm(props),
}))

describe('LoginPage', () => {
  it('renders the login form', async () => {
    const { getByTestId } = render(await LoginPage({ searchParams: Promise.resolve({}) }))

    expect(getByTestId('login-form')).toBeInTheDocument()
  })

  it('passes a safe redirect param to the login form', async () => {
    render(await LoginPage({ searchParams: Promise.resolve({ redirect: '/profile' }) }))

    expect(LoginForm).toHaveBeenCalledWith({ safeRedirectTo: '/profile' })
  })

  it('ignores an unsafe redirect param', async () => {
    render(await LoginPage({ searchParams: Promise.resolve({ redirect: 'https://another-domain.com' }) }))

    expect(LoginForm).toHaveBeenCalledWith({ safeRedirectTo: undefined })
  })
})
