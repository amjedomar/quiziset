import { decodeJwt } from 'jose'

/**
 * This function will return `true` when the token exists and is not expired
 * However it does NOT verify the token's signature
 *
 * It is used by "proxy.ts" to guess whether the user is logged in:
 * - The proxy runs whenever user navigates between pages (specified in config.matcher)
 *   So we shouldn't send backend request to verify the token...
 *   as this will slow down the routing and hurts the performance negatively
 * - Instead, we should use this function (since it does a fast check
 *   and guesses if user is likely logged in or not)
 *
 * If the guess was wrong (e.g. the token looks isn't expired but its signature
 * might be manipulated via devtools). That's fine because when the frontend
 * later calls the backend with an invalid token --> the backend will respond with
 * "401 Unauthorized" and then frontend will delete this invalid token cookie :)
 */
export function checkIfUserLikelyLoggedIn(token: string | undefined): boolean {
  if (!token) {
    return false
  }

  let payload: { exp?: number }

  try {
    payload = decodeJwt(token)
  } catch {
    return false
  }

  if (typeof payload.exp !== 'number') {
    // in this project the backend always return the token with "exp" field
    // so if there is no "exp" that means it wasn't issued by our backend
    // Thus, return false
    return false
  }

  // `exp` is in seconds so convert it to milliseconds (to be able to compare it with Date.now)
  const expireInMs = payload.exp * 1000

  return expireInMs > Date.now()
}

export function matchesRoute(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}
