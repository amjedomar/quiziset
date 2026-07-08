import { render } from '@testing-library/react'
import ForgotPasswordPage from './page'

const ForgotPasswordForm = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="forgot-password-form" />)
jest.mock('@/components/auth/forgot-password-form', () => ({
  ForgotPasswordForm: (props: unknown) => ForgotPasswordForm(props),
}))

describe('ForgotPasswordPage', () => {
  it('renders the forgot password form', () => {
    const { getByTestId } = render(<ForgotPasswordPage />)

    expect(getByTestId('forgot-password-form')).toBeInTheDocument()
  })
})
