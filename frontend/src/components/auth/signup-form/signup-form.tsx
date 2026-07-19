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
import { signupSchema, SignupFormData } from '@/components/auth/auth-schema'

interface SignupFormProps {
  safeRedirectTo?: string // where to redirect the user after a successful signup
  reason?: LoginReason // the reason the user was redirected to the signup page
}

export function SignupForm({ safeRedirectTo, reason }: SignupFormProps) {
  const form = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) })

  const { signup, isSigningUp } = useAuth()

  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onSubmit = async (payload: SignupFormData) => {
    setErrorMessage(null)

    const response = await signup(payload)

    if (isErrorResponse(response)) {
      setErrorMessage(response.message)
      return
    }

    router.replace(safeRedirectTo ?? '/')
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Stack direction="column" sx={{ gap: 2 }}>
          <Typography level="h3" textAlign="center">
            Sign Up
          </Typography>

          {reason && <AuthRedirectAlert action="signup" reason={reason} />}

          {errorMessage && (
            <Alert color="danger" variant="soft" data-testid="signup-error-alert">
              {errorMessage}
            </Alert>
          )}

          <FormInput name="name" label="Name" type="text" />

          <FormInput name="email" label="Email" type="email" />

          <FormInput name="password" label="Password" type="password" />

          <Button data-testid="signup-submit-button" type="submit" loading={isSigningUp}>
            Sign Up
          </Button>

          <Typography level="body-sm" textAlign="center">
            Already have an account?{' '}
            <Link component={AppLink} href={appendRedirectParam('/login', safeRedirectTo, reason)}>
              Login
            </Link>
          </Typography>
        </Stack>
      </form>
    </FormProvider>
  )
}
