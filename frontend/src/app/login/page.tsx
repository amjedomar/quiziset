import { Container } from '@mui/joy'
import { LoginForm } from '@/components/auth/login-form'
import { isSafeRedirect, REDIRECT_PARAM } from '@/utils/redirect'

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const redirectParam = (await searchParams)[REDIRECT_PARAM]
  const safeRedirectTo = typeof redirectParam === 'string' && isSafeRedirect(redirectParam) ? redirectParam : undefined

  return (
    <Container maxWidth="sm">
      <LoginForm safeRedirectTo={safeRedirectTo} />
    </Container>
  )
}
