'use client'

import { Button } from '@mui/joy'
import Link from 'next/link'
import { ReactNode, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { appendRedirectParam, REDIRECT_PARAM } from '@/utils/redirect'

export function AuthButtons() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  /**
   * only the login/signup pages need the "redirect" param (and they are dynamic anyway)
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
      <WithSearchParam paramKey={REDIRECT_PARAM}>
        {(redirectTo) => <AuthLinks redirectTo={redirectTo} />}
      </WithSearchParam>
    </Suspense>
  )
}

/**
 * a trick to use "useSearchParams" in login/signup pages ONLY
 * check comment of `AuthButtons` component above for more info
 */
const WithSearchParam = ({
  paramKey,
  children,
}: {
  paramKey: string
  children: (paramValue: string | null) => ReactNode
}) => {
  const searchParams = useSearchParams()
  return children(searchParams.get(paramKey))
}

function AuthLinks({ redirectTo }: { redirectTo?: string | null }) {
  return (
    <>
      <Button variant="outlined" component={Link} href={appendRedirectParam('/login', redirectTo)}>
        Login
      </Button>

      <Button variant="solid" component={Link} href={appendRedirectParam('/signup', redirectTo)}>
        Sign Up
      </Button>
    </>
  )
}
