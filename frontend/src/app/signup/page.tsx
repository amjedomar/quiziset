import type { Metadata } from 'next'
import { Container } from '@mui/joy'
import { SignupForm } from '@/components/auth/signup-form'
import { isLoginReason, isSafeRedirect, LOGIN_REASON_PARAM, LoginReason, REDIRECT_PARAM } from '@/utils/redirect'

export const metadata: Metadata = {
  title: 'Sign Up',
}

interface SignupPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams

  const redirectParam = params[REDIRECT_PARAM]
  const safeRedirectTo = typeof redirectParam === 'string' && isSafeRedirect(redirectParam) ? redirectParam : undefined

  const reasonParam = params[LOGIN_REASON_PARAM]
  const verifiedReason = typeof reasonParam === 'string' && isLoginReason(reasonParam) ? reasonParam : undefined

  const reason = safeRedirectTo ? (verifiedReason ?? LoginReason.AccessProtectedPage) : undefined

  return (
    <Container maxWidth="sm">
      <SignupForm safeRedirectTo={safeRedirectTo} reason={reason} />
    </Container>
  )
}
