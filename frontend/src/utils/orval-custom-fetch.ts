import jsCookie from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const USER_TOKEN_COOKIE = 'quiziset-user-token'

const getHeaders = (headers?: HeadersInit): HeadersInit => {
  const token = jsCookie.get(USER_TOKEN_COOKIE)

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  }
}

const getBody = <T>(c: Response | Request): Promise<T> => {
  const contentType = c.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    return c.json()
  }

  return c.text() as Promise<T>
}

// 2xx success status codes (used to exclude "error types" from the return type)
type SuccessStatus = 200 | 201 | 204

/**
 * The code of this function is inspired by
 * https://github.com/orval-labs/orval/blob/master/samples/next-app-with-fetch/custom-fetch.ts
 *
 * It is a custom fetch used by all Orval auto-generated hooks
 * (check "orval.config.ts" it is provided there in "mutator.path")
 *
 * what it does?
 *  - it includes authorization header (with user's token from cookie) on every request
 *  - it throws an error (when response statusCode is 4xx or 5xx)
 *    so it can be handled separately in the "catch" block
 */
export const customFetch = async <T>(url: string, options?: RequestInit) => {
  const requestUrl = API_BASE_URL + url
  const requestHeaders = getHeaders(options?.headers)

  const response = await fetch(requestUrl, {
    ...options,
    headers: requestHeaders,
  })

  if (!response.ok) {
    /**
     * Throw error responses (so it is handled separately in the "catch" block)
     *
     * IMPORTANT!!: This is the reason why
     * below (at the end of this function) we extract success responses only
     */
    throw response
  }

  const data = await getBody<T>(response)

  /**
   * Orval's builtin fetch has an option "forceSuccessResponse"
   * see https://orval.dev/docs/reference/configuration/output#forcesuccessresponse
   *
   * However, unfortunately this option doesn't work when when we
   * provide our custom fetch function (passed to "mutator" in "orval.config.ts")
   *
   * Below is a workaround that results in the same behavior as "forceSuccessResponse" :)
   *
   * Using Extract<T, { status: SuccessStatus }> we can filter only success responses
   *
   * This is reasonable because this function throws on "!response.ok"
   * it never returns an error response --> This "Extract" makes TypeScript aware of that
   */
  return { status: response.status, data, headers: response.headers } as unknown as Extract<
    T,
    { status: SuccessStatus }
  >
}
