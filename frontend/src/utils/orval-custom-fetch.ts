import jsCookie from 'js-cookie'
import { USER_TOKEN_COOKIE } from '@/constants/auth'
import { appendRedirectParam } from '@/utils/redirect'
import { API_BASE_URL } from '@/constants/api-url'

/**
 * reads the user's auth token cookie
 *  - in the browser: via "js-cookie"
 *  - during SSR: via "next/headers"
 */
const getUserToken = async (): Promise<string | undefined> => {
  if (typeof window === 'undefined') {
    // "next/headers" is server-only so it is imported dynamically
    // (a static import would crash in client)
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()

    return cookieStore.get(USER_TOKEN_COOKIE)?.value
  }

  return jsCookie.get(USER_TOKEN_COOKIE)
}

const getHeaders = async (headers?: HeadersInit): Promise<HeadersInit> => {
  const token = await getUserToken()

  return {
    ...headers,
    // only attach the header when a token exists (avoids sending "Bearer undefined")
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const getBody = <T>(c: Response | Request): Promise<T> => {
  const contentType = c.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    return c.json()
  }

  return c.text() as Promise<T>
}

const handleUnauthorized = () => {
  // if token cookie exists then remove it (since it is invalid)
  jsCookie.remove(USER_TOKEN_COOKIE)

  const { pathname, search } = window.location

  // Avoid redirecting if we're already on the login or signup page
  if (pathname === '/login' || pathname === '/signup') {
    return
  }

  // Redirect to login page
  const currentPageUrl = pathname + search

  const loginUrl = appendRedirectParam('/login', currentPageUrl)

  window.location.replace(loginUrl)
}

/**
 * The code of this function is inspired by
 * https://github.com/orval-labs/orval/blob/master/samples/next-app-with-fetch/custom-fetch.ts
 *
 * It is a custom fetch used by all Orval auto-generated hooks
 * (check "orval.config.ts" it is provided there in "mutator.path")
 *
 * What it does?
 *  - It includes authorization header (with user's token from cookie) on every request
 *  - On a 401 response it logs the user out and redirects to the /login page
 *    (except if user is already on /login or /signup page)
 */
export const customFetch = async <T>(url: string, options?: RequestInit) => {
  const requestUrl = API_BASE_URL + url
  const requestHeaders = await getHeaders(options?.headers)

  const response = await fetch(requestUrl, {
    ...options,
    headers: requestHeaders,
  })

  /**
   * run "handleUnauthorized" when status is 401 (in browser only)
   */
  if (response.status === 401 && typeof window !== 'undefined') {
    handleUnauthorized()
  }

  const data = await getBody<T>(response)

  return { status: response.status, data, headers: response.headers } as T
}
