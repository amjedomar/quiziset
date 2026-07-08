import { fireEvent, render, waitFor } from '@testing-library/react'
import { ResetPasswordForm } from './reset-password-form'

const replace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}))

const resetPassword = jest.fn()
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ resetPassword, isResettingPassword: false }),
}))

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('correctly renders', () => {
    const { asFragment } = render(<ResetPasswordForm token="reset-token" />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('shows an invalid-link alert when there is no token', () => {
    const { getByTestId } = render(<ResetPasswordForm />)
    expect(getByTestId('reset-invalid-link-alert')).toBeInTheDocument()
  })

  it('resets the password and redirects home on success', async () => {
    resetPassword.mockResolvedValue({ accessToken: 'token' })

    const { getByLabelText, getByTestId } = render(<ResetPasswordForm token="reset-token" />)

    fireEvent.change(getByLabelText('New password'), { target: { value: 'new-secret-123' } })
    fireEvent.change(getByLabelText('Confirm new password'), { target: { value: 'new-secret-123' } })
    fireEvent.click(getByTestId('reset-submit-button'))

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({ token: 'reset-token', password: 'new-secret-123' })
      expect(replace).toHaveBeenCalledWith('/')
    })
  })

  it('shows a validation error and does not submit when the password is too short', async () => {
    const { getByLabelText, getByTestId, getByText } = render(<ResetPasswordForm token="reset-token" />)

    fireEvent.change(getByLabelText('New password'), { target: { value: 'short' } })
    fireEvent.change(getByLabelText('Confirm new password'), { target: { value: 'short' } })
    fireEvent.click(getByTestId('reset-submit-button'))

    await waitFor(() => {
      expect(getByText('Password must be at least 8 characters')).toBeInTheDocument()
    })
    expect(resetPassword).not.toHaveBeenCalled()
  })

  it('shows an error and does not submit when the passwords do not match', async () => {
    const { getByLabelText, getByTestId, getByText } = render(<ResetPasswordForm token="reset-token" />)

    fireEvent.change(getByLabelText('New password'), { target: { value: 'new-secret-123' } })
    fireEvent.change(getByLabelText('Confirm new password'), { target: { value: 'different-123' } })
    fireEvent.click(getByTestId('reset-submit-button'))

    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeInTheDocument()
    })
    expect(resetPassword).not.toHaveBeenCalled()
  })
})
