'use client'
import { Button, Link, Stack, Typography } from '@mui/joy'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { SignupDto } from '@/generated-api-client/model'
import { useAuth } from '@/hooks/use-auth'
import { appendRedirectParam, LoginReason } from '@/utils/redirect'
import { AuthRedirectAlert } from '@/components/auth/auth-redirect-alert'
import { FormInput } from '@/ui/form-fields/form-input'
import { isErrorResponse } from '@/utils/is-error-response'

interface SignupFormProps {
  safeRedirectTo?: string // where to redirect the user after a successful signup
  reason?: LoginReason // the reason the user was redirected to the signup page
}

export function SignupForm({ safeRedirectTo, reason }: SignupFormProps) {
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

          {reason && <AuthRedirectAlert action="signup" reason={reason} />}

          <FormInput name="name" label="Name" type="text" />

          <FormInput name="email" label="Email" type="email" />

          <FormInput name="password" label="Password" type="password" />

          <Button data-testid="signup-submit-button" type="submit" loading={isSigningUp}>
            Sign Up
          </Button>

          <Typography level="body-sm" textAlign="center">
            Already have an account?{' '}
            <Link component={NextLink} href={appendRedirectParam('/login', safeRedirectTo, reason)}>
              Login
            </Link>
          </Typography>
        </Stack>
      </form>
    </FormProvider>
  )
}
