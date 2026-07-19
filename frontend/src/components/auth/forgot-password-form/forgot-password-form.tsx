'use client'
import { useState } from 'react'
import { Alert, Button, Link, Stack, Typography } from '@mui/joy'
import { AppLink } from '@/ui/app-link'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/use-auth'
import { FormInput } from '@/ui/form-fields/form-input'
import { isErrorResponse } from '@/utils/is-error-response'
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/components/auth/auth-schema'

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) })

  const { requestPasswordReset, isRequestingPasswordReset } = useAuth()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)
  // the mailcatcher web UI link (only returned in development)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onSubmit = async (payload: ForgotPasswordFormData) => {
    setErrorMessage(null)

    const response = await requestPasswordReset(payload)

    if (isErrorResponse(response)) {
      // e.g. no account exists with this email
      setErrorMessage(response.message)
      return
    }

    setIsSent(true)
    setPreviewUrl(response.previewUrl ?? null)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Stack direction="column" sx={{ gap: 2 }}>
          <Typography level="h3" textAlign="center">
            Reset your password
          </Typography>

          {isSent ? (
            <Alert color="success" variant="soft" data-testid="reset-sent-alert">
              <Stack sx={{ gap: 1 }}>
                <span>We sent an email to you with the link to reset your password (it expires in 3 hours)</span>

                {previewUrl && (
                  <Link href={previewUrl} target="_blank" rel="noopener" data-testid="mailcatcher-link">
                    Open MailCatcher to view the email
                  </Link>
                )}
              </Stack>
            </Alert>
          ) : (
            <>
              <Typography level="body-sm" textAlign="center">
                Enter your email and we will send you a link to reset your password
              </Typography>

              {errorMessage && (
                <Alert color="danger" variant="soft" data-testid="reset-error-alert">
                  <Stack sx={{ gap: 1 }}>
                    <span>{errorMessage}</span>
                    <Link component={AppLink} href="/signup">
                      Go to Sign Up
                    </Link>
                  </Stack>
                </Alert>
              )}

              <FormInput name="email" label="Email" type="email" />

              <Button data-testid="request-reset-button" type="submit" loading={isRequestingPasswordReset}>
                Send reset link
              </Button>

              <Typography level="body-sm" textAlign="center">
                Remembered your password?{' '}
                <Link component={AppLink} href="/login">
                  Login
                </Link>
              </Typography>
            </>
          )}
        </Stack>
      </form>
    </FormProvider>
  )
}
