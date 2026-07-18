'use client'
import { useState } from 'react'
import { Alert, Button, Link, Stack, Typography } from '@mui/joy'
import { AppLink } from '@/ui/app-link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/use-auth'
import { appendRedirectParam, LoginReason } from '@/utils/redirect'
import { AuthRedirectAlert } from '@/components/auth/auth-redirect-alert'
import { FormInput } from '@/ui/form-fields/form-input'
import { isErrorResponse } from '@/utils/is-error-response'
import { loginSchema, LoginFormData } from '@/components/auth/auth-schema'

interface LoginFormProps {
  safeRedirectTo?: string // where to redirect the user after a successful login
  reason?: LoginReason // the reason the user was redirected to the login page
}

export function LoginForm({ safeRedirectTo, reason }: LoginFormProps) {
  const form = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const { login, isLogging } = useAuth()

  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (payload: LoginFormData) => {
    setErrorMessage(null)

    const response = await login(payload)

    if (isErrorResponse(response)) {
      setErrorMessage(response.message)
      return
    }

    router.replace(safeRedirectTo ?? '/')
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Stack direction="column" spacing={2}>
          <Typography level="h3" textAlign="center">
            Login
          </Typography>

          {reason && <AuthRedirectAlert action="login" reason={reason} />}

          {errorMessage && (
            <Alert color="danger" variant="soft" data-testid="login-error-alert">
              {errorMessage}
            </Alert>
          )}

          <FormInput name="email" label="Email" type="email" />

          <FormInput name="password" label="Password" type="password" />

          <Typography level="body-sm">
            <Link component={AppLink} href="/forgot-password">
              Forgot password?
            </Link>
          </Typography>

          <Button data-testid="login-submit-button" type="submit" loading={isLogging}>
            Login
          </Button>

          <Typography level="body-sm" textAlign="center">
            Do not have an account?{' '}
            <Link component={AppLink} href={appendRedirectParam('/signup', safeRedirectTo, reason)}>
              Sign up
            </Link>
          </Typography>
        </Stack>
      </form>
    </FormProvider>
  )
}
