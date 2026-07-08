'use client'
import { useState } from 'react'
import { Alert, Button, Link, Stack, Typography } from '@mui/joy'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/use-auth'
import { FormInput } from '@/ui/form-fields/form-input'
import { isErrorResponse } from '@/utils/is-error-response'

interface ResetPasswordFormProps {
  token?: string // the reset token from the emailed link (?token=... query param)
}

interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordFormData>()

  const { resetPassword, isResettingPassword } = useAuth()

  const router = useRouter()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // a missing token means the link is invalid
  if (!token) {
    return (
      <Alert color="danger" variant="soft" data-testid="reset-invalid-link-alert">
        <Stack spacing={1}>
          <span>This password reset link is invalid. Please request a new one.</span>
          <Link component={NextLink} href="/forgot-password">
            Request a new link
          </Link>
        </Stack>
      </Alert>
    )
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setErrorMessage(null)

    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', { message: 'Passwords do not match' })
      return
    }

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
        <Stack direction="column" spacing={2}>
          <Typography level="h3" textAlign="center">
            Choose a new password
          </Typography>

          {errorMessage && (
            <Alert color="danger" variant="soft" data-testid="reset-error-alert">
              <Stack spacing={1}>
                <span>{errorMessage}</span>
                <Link component={NextLink} href="/forgot-password">
                  Request a new link
                </Link>
              </Stack>
            </Alert>
          )}

          <FormInput
            name="password"
            label="New password"
            type="password"
            rules={{
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            }}
          />

          <FormInput
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            rules={{ required: 'Please confirm your password' }}
          />

          <Button data-testid="reset-submit-button" type="submit" loading={isResettingPassword}>
            Reset password and login
          </Button>
        </Stack>
      </form>
    </FormProvider>
  )
}
