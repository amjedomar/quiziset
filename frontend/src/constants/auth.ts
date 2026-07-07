import { NEXT_PUBLIC_API_BASE_URL } from '@/constants/api-url'
import { getParentDomain } from '@/utils/url'

export const USER_TOKEN_COOKIE = 'quiziset-user-token'

/**
 * attributes used whenever the auth token cookie is set or removed
 *
 * Although this project I developed it to be ran on localhost only
 * (since it is just a university assignment)
 *
 * but I want it to be production-ready too! :)
 * so lets set the cookie in parent domain so it is accessible for subdomains
 *
 * IMPORTANT!!!: set and remove of cookie must use the same attributes
 * or the browser won't match the cookie to delete it
 */
export const getUserTokenCookieAttributes = (): Cookies.CookieAttributes => ({
  domain: getParentDomain(NEXT_PUBLIC_API_BASE_URL),
  /**
   * setting "sameSite" to "strict" / "lax" protect against CSRF
   * see https://security.stackexchange.com/questions/234386/do-i-still-need-csrf-protection-when-samesite-is-set-to-lax
   *
   * here we use "lax" to allow subdomain
   *
   * btw API is already protecting against CSRF by extracting the token
   * from "Authorization" header instead of cookie
   * see  https://security.stackexchange.com/questions/170388/do-i-need-csrf-token-if-im-using-bearer-jwt
   *
   * we are just being extra careful here
   */
  sameSite: 'lax',
  // only marks it as secure if website uses https (so localhost http setup still works)
  secure: window.location.protocol === 'https:',
})
