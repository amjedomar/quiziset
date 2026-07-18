import NextLink from 'next/link'
import { ComponentProps } from 'react'
import { PROTECTED_ROUTES, GUEST_ONLY_ROUTES } from '@/constants/auth-pages'
import { matchesRoute } from '@/utils/url'

const PROXY_REDIRECTED_ROUTES = [...PROTECTED_ROUTES, ...GUEST_ONLY_ROUTES]

type AppLinkProps = ComponentProps<typeof NextLink>

export function AppLink({ href, prefetch, ...props }: AppLinkProps) {
  /**
   * Next.js has an internal bug see https://github.com/vercel/next.js/issues/88937
   * in "production" mode after it prefetches the page (it doesn't re-run proxy.ts
   * when the page is accessed again)
   *
   * The issue here is that it prevents client-side redirecting to a protected
   * page (e.g. /manage-quizzes) after user is logged in (again this only occurs in "production" mode
   * since prefetching is disabled in "development" mode)
   *
   * there is currently a PR that fixed the issue https://github.com/vercel/next.js/pull/89618
   * but still not merged yet :(
   *
   * There are different workarounds but I preferred the first solution
   * as mentioned in that GitHub issue https://github.com/vercel/next.js/issues/8893
   * is to disable "prefetch" for the links that references such pages
   */
  const disablePrefetch = matchesRoute(href.toString(), PROXY_REDIRECTED_ROUTES)

  return <NextLink href={href} prefetch={disablePrefetch ? false : prefetch} {...props} />
}
