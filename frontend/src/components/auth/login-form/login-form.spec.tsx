import { fireEvent, render, waitFor } from '@testing-library/react'
import { LoginForm } from './login-form'

const replace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}))

const login = jest.fn()
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ login, isLogging: false }),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('correctly renders', () => {
    const { asFragment } = render(<LoginForm />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('logs in with the entered credentials and redirects on success', async () => {
    login.mockResolvedValue({ accessToken: 'token' })

    const { getByLabelText, getByTestId } = render(<LoginForm />)

    fireEvent.change(getByLabelText('Email'), { target: { value: 'amjed@example.com' } })
    fireEvent.change(getByLabelText('Password'), { target: { value: 'secret' } })
    fireEvent.click(getByTestId('login-submit-button'))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ email: 'amjed@example.com', password: 'secret' })
      expect(replace).toHaveBeenCalledWith('/')
    })
  })
})
