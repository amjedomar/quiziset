'use client'
import { Alert, Button, Link, Stack, Typography } from '@mui/joy'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { SignupDto } from '@/generated-api-client/model'
import { useAuth } from '@/hooks/use-auth'
import { appendRedirectParam } from '@/utils/redirect'
import { FormInput } from '@/ui/form-fields/form-input'
import { isErrorResponse } from '@/utils/is-error-response'

interface SignupFormProps {
  safeRedirectTo?: string // where to redirect the user after a successful signup
}

export function SignupForm({ safeRedirectTo }: SignupFormProps) {
  const form = useForm<SignupDto>()

  const { signup, isSigningUp } = useAuth()

  const router = useRouter()

  const onSubmit = async (payload: SignupDto) => {
    const response = await signup(payload)

    if (!isErrorResponse(response)) {
      router.replace(safeRedirectTo ?? '/')
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={2}>
          <Typography level="h3" textAlign="center">
            Sign Up
          </Typography>

          {safeRedirectTo && (
            <Alert color="primary" variant="soft">
              Please signup then you will be redirected back to the last page you were trying to access
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
            <Link component={NextLink} href={appendRedirectParam('/login', safeRedirectTo)}>
              Login
            </Link>
          </Typography>
        </Stack>
      </form>
    </FormProvider>
  )
}
