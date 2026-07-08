import { render } from '@testing-library/react'
import ResetPasswordPage from './page'

const ResetPasswordForm = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="reset-password-form" />)
jest.mock('@/components/auth/reset-password-form', () => ({
  ResetPasswordForm: (props: unknown) => ResetPasswordForm(props),
}))

describe('ResetPasswordPage', () => {
  it('passes the token query param to the reset form', async () => {
    render(await ResetPasswordPage({ searchParams: Promise.resolve({ token: 'abc' }) }))

    expect(ResetPasswordForm).toHaveBeenCalledWith({ token: 'abc' })
  })

  it('passes undefined when the token param is missing', async () => {
    render(await ResetPasswordPage({ searchParams: Promise.resolve({}) }))

    expect(ResetPasswordForm).toHaveBeenCalledWith({ token: undefined })
  })
})
