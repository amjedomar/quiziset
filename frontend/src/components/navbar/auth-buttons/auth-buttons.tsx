'use client'

import { Button } from '@mui/joy'
import { AppLink } from '@/ui/app-link'
import { ReactNode, Suspense } from 'react'
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation'
import { appendRedirectParam, isLoginReason, LOGIN_REASON_PARAM, LoginReason, REDIRECT_PARAM } from '@/utils/redirect'

export function AuthButtons() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  /**
   * only the login/signup pages need the "redirect" (and "reason") params (and they are dynamic anyway)
   * so only there we should use useSearchParams (which requires <Suspense>
   * but again since auth pages are dynamic these buttons will be rendered immediately
   * <Suspense> is just needed to avoid production build errors)
   *
   * in the other pages don't use it (as it isn't needed) so in static pages
   * auth buttons are displayed immediately
   */
  if (!isAuthPage) {
    return <AuthLinks />
  }

  return (
    <Suspense>
      <WithSearchParams>
        {(searchParams) => {
          const reasonParam = searchParams.get(LOGIN_REASON_PARAM)

          return (
            <AuthLinks
              redirectTo={searchParams.get(REDIRECT_PARAM)}
              reason={isLoginReason(reasonParam) ? reasonParam : undefined}
            />
          )
        }}
      </WithSearchParams>
    </Suspense>
  )
}

/**
 * a trick to use "useSearchParams" in login/signup pages ONLY
 * check comment of `AuthButtons` component above for more info
 */
const WithSearchParams = ({ children }: { children: (searchParams: ReadonlyURLSearchParams) => ReactNode }) => {
  const searchParams = useSearchParams()
  return children(searchParams)
}

function AuthLinks({ redirectTo, reason }: { redirectTo?: string | null; reason?: LoginReason }) {
  return (
    <>
      <Button
        data-testid="login-link"
        variant="outlined"
        component={AppLink}
        href={appendRedirectParam('/login', redirectTo, reason)}
      >
        Login
      </Button>

      <Button
        data-testid="signup-link"
        variant="solid"
        component={AppLink}
        href={appendRedirectParam('/signup', redirectTo, reason)}
      >
        Sign Up
      </Button>
    </>
  )
}
