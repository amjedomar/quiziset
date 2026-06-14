import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import jsCookie from 'js-cookie'
import { useLogin } from '@/api-client/auth'
import { LoginDto } from '@/api-client/model'
import { isErrorResponse } from '@/utils/is-error-response'

const USER_TOKEN_COOKIE = 'quiziset-user-token'
const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30

// interfaces & types
interface AuthState {
  isLoggedIn: boolean | null // null means that "isLoggedIn" not checked yet
  isLogging: boolean
}

interface AuthMethods {
  login: (payload: LoginDto) => Promise<void>
}

type AuthContextValue = AuthState & AuthMethods

interface AuthProviderProps {
  children: ReactNode
}

// AuthContext
const defaultState: AuthState = {
  isLoggedIn: null,
  isLogging: false,
}

const defaultMethods: AuthMethods = {
  login: () => Promise.resolve(),
}

const AuthContext = createContext<AuthContextValue>({
  ...defaultState,
  ...defaultMethods,
})

// AuthProvider
export function AuthProvider({ children }: AuthProviderProps) {
  // To avoid Hydration issues set the state using "useEffect"
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { mutateAsync: mutateLogin, isPending } = useLogin()

  // Initial Check during page load
  useEffect(() => {
    const token = jsCookie.get(USER_TOKEN_COOKIE)

    setIsLoggedIn(!!token)
  }, [])

  // Methods
  const login = useCallback(
    async (payload: LoginDto) => {
      const { data } = await mutateLogin({ data: payload })

      if (!isErrorResponse(data)) {
        jsCookie.set(USER_TOKEN_COOKIE, data.accessToken, { expires: Date.now() + MONTH_IN_MS })
      }
    },
    [mutateLogin],
  )

  // Context Value
  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      isLogging: isPending,
      login,
    }),
    [isLoggedIn, isPending, login],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// useAuth hook
export const useAuth = () => useContext(AuthContext)
