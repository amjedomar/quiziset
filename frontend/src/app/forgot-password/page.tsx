import type { Metadata } from 'next'
import { Container } from '@mui/joy'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot Password',
}

export default function ForgotPasswordPage() {
  return (
    <Container maxWidth="sm">
      <ForgotPasswordForm />
    </Container>
  )
}
