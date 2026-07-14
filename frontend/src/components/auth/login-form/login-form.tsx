'use client'
import { Button, Link, Stack, Typography } from '@mui/joy'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { LoginDto } from '@/generated-api-client/model'
import { useAuth } from '@/hooks/use-auth'
import { appendRedirectParam, LoginReason } from '@/utils/redirect'
import { AuthRedirectAlert } from '@/components/auth/auth-redirect-alert'
import { FormInput } from '@/ui/form-fields/form-input'
import { isErrorResponse } from '@/utils/is-error-response'

interface LoginFormProps {
  safeRedirectTo?: string // where to redirect the user after a successful login
  reason?: LoginReason // the reason the user was redirected to the login page
}

export function LoginForm({ safeRedirectTo, reason }: LoginFormProps) {
  const form = useForm<LoginDto>()

  const { login, isLogging } = useAuth()

  const router = useRouter()

  const onSubmit = async (payload: LoginDto) => {
    const response = await login(payload)

    if (!isErrorResponse(response)) {
      router.replace(safeRedirectTo ?? '/')
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={2}>
          <Typography level="h3" textAlign="center">
            Login
          </Typography>

          {reason && <AuthRedirectAlert action="login" reason={reason} />}

          <FormInput name="email" label="Email" type="email" />

          <FormInput name="password" label="Password" type="password" />

          <Typography level="body-sm">
            <Link component={NextLink} href="/forgot-password">
              Forgot password?
            </Link>
          </Typography>

          <Button data-testid="login-submit-button" type="submit" loading={isLogging}>
            Login
          </Button>

          <Typography level="body-sm" textAlign="center">
            Do not have an account?{' '}
            <Link component={NextLink} href={appendRedirectParam('/signup', safeRedirectTo, reason)}>
              Sign up
            </Link>
          </Typography>
        </Stack>
      </form>
    </FormProvider>
  )
}
