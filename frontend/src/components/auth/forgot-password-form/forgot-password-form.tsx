'use client'
import { useState } from 'react'
import { Alert, Button, Link, Stack, Typography } from '@mui/joy'
import NextLink from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { RequestPasswordResetDto } from '@/generated-api-client/model'
import { useAuth } from '@/hooks/use-auth'
import { FormInput } from '@/ui/form-fields/form-input'
import { isErrorResponse } from '@/utils/is-error-response'
import { EMAIL_REGEX } from '@/constants/email-regex'

export function ForgotPasswordForm() {
  const form = useForm<RequestPasswordResetDto>()

  const { requestPasswordReset, isRequestingPasswordReset } = useAuth()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)
  // the mailcatcher web UI link (only returned in development)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onSubmit = async (payload: RequestPasswordResetDto) => {
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
        <Stack direction="column" spacing={2}>
          <Typography level="h3" textAlign="center">
            Reset your password
          </Typography>

          {isSent ? (
            <Alert color="success" variant="soft" data-testid="reset-sent-alert">
              <Stack spacing={1}>
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
                  <Stack spacing={1}>
                    <span>{errorMessage}</span>
                    <Link component={NextLink} href="/login">
                      Go to login
                    </Link>
                  </Stack>
                </Alert>
              )}

              <FormInput
                name="email"
                label="Email"
                type="email"
                rules={{
                  required: 'Email is required',
                  pattern: { value: EMAIL_REGEX, message: 'Email is invalid' },
                }}
              />

              <Button data-testid="request-reset-button" type="submit" loading={isRequestingPasswordReset}>
                Send reset link
              </Button>

              <Typography level="body-sm" textAlign="center">
                Remembered your password?{' '}
                <Link component={NextLink} href="/login">
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
