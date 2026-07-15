import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import jsCookie from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useLogin, useRequestPasswordReset, useResetPassword, useSignup } from '@/generated-api-client/auth'
import { useGetMe } from '@/generated-api-client/user'
import {
  AuthToken,
  ErrorResponse,
  LoginDto,
  PasswordResetRequestResponse,
  RequestPasswordResetDto,
  ResetPasswordDto,
  SignupDto,
  UserEntity,
} from '@/generated-api-client/model'
import { isErrorResponse } from '@/utils/is-error-response'
import { USER_TOKEN_COOKIE, getUserTokenCookieAttributes } from '@/constants/auth'
import { useRetainedQuery } from '@/hooks/use-retained-query'

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30

interface AuthContextValue {
  // state
  isLoggedIn: boolean
  isCheckingLogin: boolean
  isLogging: boolean
  isSigningUp: boolean
  isRequestingPasswordReset: boolean
  isResettingPassword: boolean
  currentUser: UserEntity | undefined
  isLoadingCurrentUser: boolean

  // methods
  login: (payload: LoginDto) => Promise<AuthToken | ErrorResponse>
  signup: (payload: SignupDto) => Promise<AuthToken | ErrorResponse>
  requestPasswordReset: (payload: RequestPasswordResetDto) => Promise<PasswordResetRequestResponse | ErrorResponse>
  resetPassword: (payload: ResetPasswordDto) => Promise<AuthToken | ErrorResponse>
  logout: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingLogin, setIsCheckingLogin] = useState(true)

  const { mutateAsync: mutateLogin, isPending: isLogging } = useLogin()
  const { mutateAsync: mutateSignup, isPending: isSigningUp } = useSignup()
  const { mutateAsync: mutateRequestPasswordReset, isPending: isRequestingPasswordReset } = useRequestPasswordReset()
  const { mutateAsync: mutateResetPassword, isPending: isResettingPassword } = useResetPassword()

  // fetch the current user profile (only while logged in so anonymous users never trigger the 401-redirect
  // which is handled in "orval-custom-fetch.ts")
  const currentUserQuery = useGetMe({ query: { enabled: isLoggedIn } })

  const { data: currentUser, isLoading: isLoadingCurrentUser } = useRetainedQuery(currentUserQuery, {
    allowUndefined: true,
  })

  // Initial Check during page load
  useEffect(() => {
    const token = jsCookie.get(USER_TOKEN_COOKIE)

    // if token cookie exists then we assume user is loggedIn
    // then in the "useGetMe" request if token is invalid or expired
    // backend will respond with 401 error and "orval-custom-fetch.ts"
    // will handle this error and remove the token cookie and logout user

    setIsLoggedIn(!!token)
    setIsCheckingLogin(false)
  }, [])

  useEffect(() => {
    if (isCheckingLogin) return

    // see "app/layout.tsx" for more info
    document.documentElement.setAttribute('data-auth-logged-in', String(isLoggedIn))
  }, [isLoggedIn, isCheckingLogin])

  // handleAuthSuccess (called after login or signup succeeded)
  const handleAuthSuccess = useCallback((accessToken: string) => {
    jsCookie.set(USER_TOKEN_COOKIE, accessToken, {
      expires: Date.now() + MONTH_IN_MS,
      ...getUserTokenCookieAttributes(),
    })
    setIsLoggedIn(true)
  }, [])

  // Methods
  const login = useCallback(
    async (payload: LoginDto) => {
      const { data } = await mutateLogin({ data: payload })

      if (!isErrorResponse(data)) {
        handleAuthSuccess(data.accessToken)
      }

      return data
    },
    [mutateLogin, handleAuthSuccess],
  )

  const signup = useCallback(
    async (payload: SignupDto) => {
      const { data } = await mutateSignup({ data: payload })

      if (!isErrorResponse(data)) {
        handleAuthSuccess(data.accessToken)
      }

      return data
    },
    [mutateSignup, handleAuthSuccess],
  )

  const requestPasswordReset = useCallback(
    async (payload: RequestPasswordResetDto) => {
      const { data } = await mutateRequestPasswordReset({ data: payload })

      return data
    },
    [mutateRequestPasswordReset],
  )

  const resetPassword = useCallback(
    async (payload: ResetPasswordDto) => {
      const { data } = await mutateResetPassword({ data: payload })

      if (!isErrorResponse(data)) {
        handleAuthSuccess(data.accessToken)
      }

      return data
    },
    [mutateResetPassword, handleAuthSuccess],
  )

  const logout = useCallback(() => {
    jsCookie.remove(USER_TOKEN_COOKIE, getUserTokenCookieAttributes())
    setIsLoggedIn(false)
    /**
     * clear all cached data (since some might be related to
     * the authenticated user e.g. the current user profile & favorites)
     * see https://tanstack.com/query/v4/docs/reference/QueryClient#queryclient-clear
     */
    queryClient.clear()
    router.push('/')
  }, [queryClient, router])

  // Context Value
  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      isCheckingLogin,
      isLogging,
      isSigningUp,
      isRequestingPasswordReset,
      isResettingPassword,
      currentUser,
      isLoadingCurrentUser,
      login,
      signup,
      requestPasswordReset,
      resetPassword,
      logout,
    }),
    [
      isLoggedIn,
      isCheckingLogin,
      isLogging,
      isSigningUp,
      isRequestingPasswordReset,
      isResettingPassword,
      currentUser,
      isLoadingCurrentUser,
      login,
      signup,
      requestPasswordReset,
      resetPassword,
      logout,
    ],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// useAuth hook
export const useAuth = (): AuthContextValue => {
  const contextValue = useContext(AuthContext)

  if (!contextValue) {
    throw new Error('useAuth hook can only be used within AuthProvider')
  }

  return contextValue
}
