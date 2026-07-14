import { fireEvent, render, waitFor } from '@testing-library/react'
import { SignupForm } from './signup-form'

const replace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}))

const signup = jest.fn()
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ signup, isSigningUp: false }),
}))

describe('SignupForm', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('correctly renders', () => {
    const { asFragment } = render(<SignupForm />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('signs up with the entered details and redirects on success', async () => {
    signup.mockResolvedValue({ accessToken: 'token' })

    const { getByLabelText, getByTestId } = render(<SignupForm />)

    fireEvent.change(getByLabelText('Name'), { target: { value: 'Amjed Omar' } })
    fireEvent.change(getByLabelText('Email'), { target: { value: 'amjed@example.com' } })
    fireEvent.change(getByLabelText('Password'), { target: { value: 'secret-123' } })
    fireEvent.click(getByTestId('signup-submit-button'))

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({ name: 'Amjed Omar', email: 'amjed@example.com', password: 'secret-123' })
      expect(replace).toHaveBeenCalledWith('/')
    })
  })
})
