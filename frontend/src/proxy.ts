import { NextRequest, NextResponse } from 'next/server'
import { USER_TOKEN_COOKIE } from '@/constants/auth'
import { appendRedirectParam } from '@/utils/redirect'
import { checkIfUserLikelyLoggedIn, matchesRoute } from '@/utils/nextjs-proxy-utils'

/**
 * IMPORTANT!!!: When you add/remove routes here then please also update config "matcher" below
 */
const ROUTES = {
  // Routes that require user to be logged in
  PROTECTED: ['/manage-quizzes', '/quizzes/:quizId/session'],

  // Routes that can be accessed only if user is logged out
  GUEST_ONLY: ['/login', '/signup'],
}

/**
 * This proxy ensures that:
 * - if user is logged out and tried to access "ROUTES.PROTECTED"
 *   it will redirect them to /login (with "?redirect" query param)
 * - In contrast, if logged in user tried to access "Routes.GUEST_ONLY"
 *   it will redirect them to home page
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get(USER_TOKEN_COOKIE)?.value
  const isUserLikelyLoggedIn = checkIfUserLikelyLoggedIn(token)

  if (!isUserLikelyLoggedIn && matchesRoute(pathname, ROUTES.PROTECTED)) {
    const currentPageUrl = pathname + search

    // NextResponse.redirect requires an absolute URL
    const loginAbsoluteUrl = new URL('/login', request.url).toString()

    const loginFinalUrl = appendRedirectParam(loginAbsoluteUrl, currentPageUrl)

    return NextResponse.redirect(loginFinalUrl)
  }

  if (isUserLikelyLoggedIn && matchesRoute(pathname, ROUTES.GUEST_ONLY)) {
    // NextResponse.redirect requires an absolute URL
    const homeAbsoluteUrl = new URL('/', request.url).toString()

    return NextResponse.redirect(homeAbsoluteUrl)
  }

  return NextResponse.next()
}

/**
 * IMPORTANT!!!: Specify the values of "matcher" statically
 * DON'T do it like this [...ROUTES.PROTECTED, ...ROUTES.GUEST_ONLY] it won't work
 *
 * Because Next.js docs mentioned:
 * "The matcher values need to be constants so they can be statically
 * analyzed at build-time. Dynamic values such as variables will be ignored"
 * source: https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
 */
export const config = {
  matcher: ['/manage-quizzes/:path*', '/quizzes/:quizId/session', '/login', '/signup'],
}
