import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import jsCookie from 'js-cookie'
import { useLogin, useSignup } from '@/api-client/auth'
import { AuthToken, ErrorResponse, LoginDto, SignupDto } from '@/api-client/model'
import { isErrorResponse } from '@/utils/is-error-response'
import { USER_TOKEN_COOKIE } from '@/constants/auth'

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30

interface AuthContextValue {
  // state
  isLoggedIn: boolean | null // null means that "isLoggedIn" not checked yet
  isLogging: boolean
  isSigningUp: boolean

  // methods
  login: (payload: LoginDto) => Promise<AuthToken | ErrorResponse>
  signup: (payload: SignupDto) => Promise<AuthToken | ErrorResponse>
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  const { mutateAsync: mutateLogin, isPending: isLogging } = useLogin()
  const { mutateAsync: mutateSignup, isPending: isSigningUp } = useSignup()

  // Initial Check during page load
  useEffect(() => {
    const token = jsCookie.get(USER_TOKEN_COOKIE)

    setIsLoggedIn(!!token)
  }, [])

  // handleAuthSuccess (called after login or signup succeeded)
  const handleAuthSuccess = useCallback((accessToken: string) => {
    jsCookie.set(USER_TOKEN_COOKIE, accessToken, { expires: Date.now() + MONTH_IN_MS })
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

  // Context Value
  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      isLogging,
      isSigningUp,
      login,
      signup,
    }),
    [isLoggedIn, isLogging, isSigningUp, login, signup],
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
