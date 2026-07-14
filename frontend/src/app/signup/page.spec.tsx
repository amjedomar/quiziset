import { render } from '@testing-library/react'
import SignupPage from './page'
import { LoginReason } from '@/utils/redirect'

const SignupForm = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="signup-form" />)
jest.mock('@/components/auth/signup-form', () => ({
  SignupForm: (props: unknown) => SignupForm(props),
}))

describe('SignupPage', () => {
  it('renders the signup form', async () => {
    const { getByTestId } = render(await SignupPage({ searchParams: Promise.resolve({}) }))

    expect(getByTestId('signup-form')).toBeInTheDocument()
  })

  it('passes a safe redirect param to the signup form', async () => {
    render(
      await SignupPage({
        searchParams: Promise.resolve({ redirect: '/profile', reason: LoginReason.AccessProtectedPage }),
      }),
    )

    expect(SignupForm).toHaveBeenCalledWith({ safeRedirectTo: '/profile', reason: LoginReason.AccessProtectedPage })
  })

  it('ignores an unsafe redirect param', async () => {
    render(await SignupPage({ searchParams: Promise.resolve({ redirect: 'https://another-domain.com' }) }))

    expect(SignupForm).toHaveBeenCalledWith({ safeRedirectTo: undefined })
  })
})
