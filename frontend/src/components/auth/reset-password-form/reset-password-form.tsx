'use client'
import { useState } from 'react'
import { Alert, Button, Link, Stack, Typography } from '@mui/joy'
import { AppLink } from '@/ui/app-link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/use-auth'
import { FormInput } from '@/ui/form-fields/form-input'
import { isErrorResponse } from '@/utils/is-error-response'
import { resetPasswordSchema, ResetPasswordFormData } from '@/components/auth/auth-schema'

interface ResetPasswordFormProps {
  token?: string // the reset token from the emailed link (?token=... query param)
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) })

  const { resetPassword, isResettingPassword } = useAuth()

  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // a missing token means the link is invalid
  if (!token) {
    return (
      <Alert color="danger" variant="soft" data-testid="reset-invalid-link-alert">
        <Stack sx={{ gap: 1 }}>
          <span>This password reset link is invalid. Please request a new one.</span>
          <Link component={AppLink} href="/forgot-password">
            Request a new link
          </Link>
        </Stack>
      </Alert>
    )
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setErrorMessage(null)

    const response = await resetPassword({ token, password: data.password })

    if (isErrorResponse(response)) {
      setErrorMessage(response.message) // e.g. the link expired or was already used
      return
    }

    // the reset also logs the user in (cookie is already set in "useAuth") so send them to explore page :)
    router.replace('/')
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Stack direction="column" sx={{ gap: 2 }}>
          <Typography level="h3" textAlign="center">
            Choose a new password
          </Typography>

          {errorMessage && (
            <Alert color="danger" variant="soft" data-testid="reset-error-alert">
              <Stack sx={{ gap: 1 }}>
                <span>{errorMessage}</span>
                <Link component={AppLink} href="/forgot-password">
                  Request a new link
                </Link>
              </Stack>
            </Alert>
          )}

          <FormInput name="password" label="New password" type="password" />

          <FormInput name="confirmPassword" label="Confirm new password" type="password" />

          <Button data-testid="reset-submit-button" type="submit" loading={isResettingPassword}>
            Reset password and login
          </Button>
        </Stack>
      </form>
    </FormProvider>
  )
}
