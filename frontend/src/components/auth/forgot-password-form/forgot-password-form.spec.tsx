import { fireEvent, render, waitFor } from '@testing-library/react'
import { ForgotPasswordForm } from './forgot-password-form'

const requestPasswordReset = jest.fn()
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ requestPasswordReset, isRequestingPasswordReset: false }),
}))

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('correctly renders', () => {
    const { asFragment } = render(<ForgotPasswordForm />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('sends a reset link and shows the mailcatcher link (in development mode) on success', async () => {
    requestPasswordReset.mockResolvedValue({ previewUrl: 'http://localhost:1080' })

    const { getByLabelText, getByTestId } = render(<ForgotPasswordForm />)

    fireEvent.change(getByLabelText('Email'), { target: { value: 'amjed@example.com' } })
    fireEvent.click(getByTestId('request-reset-button'))

    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenCalledWith({ email: 'amjed@example.com' })
      expect(getByTestId('reset-sent-alert')).toBeInTheDocument()
      expect(getByTestId('mailcatcher-link')).toHaveAttribute('href', 'http://localhost:1080')
    })
  })

  it('shows a validation error and does not submit for an invalid email', async () => {
    const { getByLabelText, getByTestId, getByText } = render(<ForgotPasswordForm />)

    fireEvent.change(getByLabelText('Email'), { target: { value: 'not-an-email' } })
    fireEvent.click(getByTestId('request-reset-button'))

    await waitFor(() => {
      expect(getByText('Email is invalid')).toBeInTheDocument()
    })
    expect(requestPasswordReset).not.toHaveBeenCalled()
  })

  it('shows an error alert with a login link when no account exists', async () => {
    requestPasswordReset.mockResolvedValue({ statusCode: 400, message: 'No account was found with this email' })

    const { getByLabelText, getByTestId, getByText } = render(<ForgotPasswordForm />)

    fireEvent.change(getByLabelText('Email'), { target: { value: 'non-existing-user@example.com' } })
    fireEvent.click(getByTestId('request-reset-button'))

    await waitFor(() => {
      expect(getByTestId('reset-error-alert')).toBeInTheDocument()
      expect(getByText('No account was found with this email')).toBeInTheDocument()
    })
  })
})
