import type { Metadata } from 'next'
import { Container } from '@mui/joy'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata: Metadata = {
  title: 'Reset Password',
}

interface ResetPasswordPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const tokenParam = (await searchParams).token
  const token = typeof tokenParam === 'string' ? tokenParam : undefined

  return (
    <Container maxWidth="sm">
      <ResetPasswordForm token={token} />
    </Container>
  )
}
