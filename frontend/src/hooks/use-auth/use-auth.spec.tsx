import { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { USER_TOKEN_COOKIE } from '@/constants/auth'
import { AuthProvider, useAuth } from './use-auth'

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30

const jsCookieGet = jest.fn()
const jsCookieSet = jest.fn()
const jsCookieRemove = jest.fn()
jest.mock('js-cookie', () => ({
  get: (...args: unknown[]) => jsCookieGet(...args),
  set: (...args: unknown[]) => jsCookieSet(...args),
  remove: (...args: unknown[]) => jsCookieRemove(...args),
}))

const push = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

const queryClientClear = jest.fn()
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ clear: queryClientClear }),
}))

const mutateLogin = jest.fn()
const mutateSignup = jest.fn()
const mutateRequestPasswordReset = jest.fn()
const mutateResetPassword = jest.fn()
jest.mock('@/generated-api-client/auth', () => ({
  useLogin: () => ({ mutateAsync: mutateLogin, isPending: false }),
  useSignup: () => ({ mutateAsync: mutateSignup, isPending: false }),
  useRequestPasswordReset: () => ({ mutateAsync: mutateRequestPasswordReset, isPending: false }),
  useResetPassword: () => ({ mutateAsync: mutateResetPassword, isPending: false }),
}))

const useGetMe = jest.fn()
jest.mock('@/generated-api-client/user', () => ({
  useGetMe: (...args: unknown[]) => useGetMe(...args),
}))

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // we also need to call "restoreAllMocks" to reset "jest.spyOn" (which I used it below for Date.now())
    // see https://stackoverflow.com/a/59792748/8148505
    jest.restoreAllMocks()
    useGetMe.mockReturnValue({ data: undefined, isLoading: false })
  })

  it('throws when used outside of AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth hook can only be used within AuthProvider')
  })

  it('is logged in when the auth cookie exists', () => {
    jsCookieGet.mockReturnValue('the-token')

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isLoggedIn).toBe(true)
    expect(result.current.isCheckingLogin).toBe(false)
  })

  it('is not logged in when there is no auth cookie', () => {
    jsCookieGet.mockReturnValue(undefined)

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isLoggedIn).toBe(false)
  })

  it('logs the user in and sets the auth cookie on success', async () => {
    const now = Date.now()
    // make "Date.now()" value here fixed (so we can assert the same value in "expect")
    jest.spyOn(Date, 'now').mockReturnValue(now)

    jsCookieGet.mockReturnValue(undefined)
    mutateLogin.mockResolvedValue({ data: { accessToken: 'new-token' } })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login({ email: 'amjed@example.com', password: 'some-secret-123' })
    })

    expect(jsCookieSet).toHaveBeenCalledWith(
      USER_TOKEN_COOKIE,
      'new-token',
      expect.objectContaining({ expires: now + MONTH_IN_MS, sameSite: 'lax' }),
    )
    expect(result.current.isLoggedIn).toBe(true)
  })

  it('requests a password reset', async () => {
    jsCookieGet.mockReturnValue(undefined)
    mutateRequestPasswordReset.mockResolvedValue({ data: { previewUrl: 'http://localhost:1080' } })

    const { result } = renderHook(() => useAuth(), { wrapper })

    let response
    await act(async () => {
      response = await result.current.requestPasswordReset({ email: 'amjed@example.com' })
    })

    expect(mutateRequestPasswordReset).toHaveBeenCalledWith({ data: { email: 'amjed@example.com' } })
    expect(response).toEqual({ previewUrl: 'http://localhost:1080' })
    expect(result.current.isLoggedIn).toBe(false)
  })

  it('resets the password and logs the user in on success', async () => {
    const now = Date.now()
    jest.spyOn(Date, 'now').mockReturnValue(now)

    jsCookieGet.mockReturnValue(undefined)
    mutateResetPassword.mockResolvedValue({ data: { accessToken: 'new-token' } })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.resetPassword({ token: 'reset-token', password: 'new-secret-123' })
    })

    expect(mutateResetPassword).toHaveBeenCalledWith({ data: { token: 'reset-token', password: 'new-secret-123' } })
    expect(jsCookieSet).toHaveBeenCalledWith(
      USER_TOKEN_COOKIE,
      'new-token',
      expect.objectContaining({ expires: now + MONTH_IN_MS, sameSite: 'lax' }),
    )
    expect(result.current.isLoggedIn).toBe(true)
  })

  it('logs the user out and clears the cache and redirects home', () => {
    jsCookieGet.mockReturnValue('the-token')

    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      result.current.logout()
    })

    expect(jsCookieRemove).toHaveBeenCalledWith(USER_TOKEN_COOKIE, expect.objectContaining({ sameSite: 'lax' }))
    expect(result.current.isLoggedIn).toBe(false)
    expect(queryClientClear).toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith('/')
  })
})
