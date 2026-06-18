import { Container } from '@mui/joy'
import { SignupForm } from '@/components/auth/signup-form'
import { isSafeRedirect, REDIRECT_PARAM } from '@/utils/redirect'

interface SignupPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const redirectParam = (await searchParams)[REDIRECT_PARAM]
  const safeRedirectTo = typeof redirectParam === 'string' && isSafeRedirect(redirectParam) ? redirectParam : undefined

  return (
    <Container maxWidth="sm">
      <SignupForm safeRedirectTo={safeRedirectTo} />
    </Container>
  )
}
