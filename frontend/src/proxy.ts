import { NextRequest, NextResponse } from 'next/server'
import { USER_TOKEN_COOKIE } from '@/constants/auth'
import { PROTECTED_ROUTES, GUEST_ONLY_ROUTES } from '@/constants/auth-pages'
import { appendRedirectParam } from '@/utils/redirect'
import { matchesRoute } from '@/utils/url'
import { checkIfUserLikelyLoggedIn } from '@/utils/nextjs-proxy-utils'

/**
 * This proxy ensures that:
 * - if user is logged out and tried to access PROTECTED_ROUTES
 *   it will redirect them to /login (with "?redirect" query param)
 * - In contrast, if logged in user tried to access GUEST_ONLY_ROUTES
 *   it will redirect them to home page
 *
 * PROTECTED_ROUTES / GUEST_ONLY_ROUTES exists in "constants/auth-pages.ts"
 * because <AppLink> uses them too (to disable prefetch for these routes)
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get(USER_TOKEN_COOKIE)?.value
  const isUserLikelyLoggedIn = checkIfUserLikelyLoggedIn(token)

  if (!isUserLikelyLoggedIn && matchesRoute(pathname, PROTECTED_ROUTES)) {
    const currentPageUrl = pathname + search

    // NextResponse.redirect requires an absolute URL
    const loginAbsoluteUrl = new URL('/login', request.url).toString()

    const loginFinalUrl = appendRedirectParam(loginAbsoluteUrl, currentPageUrl)

    return NextResponse.redirect(loginFinalUrl)
  }

  if (isUserLikelyLoggedIn && matchesRoute(pathname, GUEST_ONLY_ROUTES)) {
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
  matcher: ['/manage-quizzes/:path*', '/quizzes/:quizId/session', '/favorites', '/profile', '/login', '/signup'],
}
