'use client'
import { Alert, Button, Link, Stack, Typography } from '@mui/joy'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { LoginDto } from '@/generated-api-client/model'
import { useAuth } from '@/hooks/use-auth'
import { appendRedirectParam } from '@/utils/redirect'
import { FormInput } from '@/ui/form-fields/form-input'
import { isErrorResponse } from '@/utils/is-error-response'

interface LoginFormProps {
  safeRedirectTo?: string // where to redirect the user after a successful login
}

export function LoginForm({ safeRedirectTo }: LoginFormProps) {
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

          {safeRedirectTo && (
            <Alert color="primary" variant="soft">
              Please login then you will be redirected back to the last page you were trying to access
            </Alert>
          )}

          <FormInput name="email" label="Email" type="email" />

          <FormInput name="password" label="Password" type="password" />

          <Button type="submit" loading={isLogging}>
            Login
          </Button>

          <Typography level="body-sm" textAlign="center">
            Do not have an account?{' '}
            <Link component={NextLink} href={appendRedirectParam('/signup', safeRedirectTo)}>
              Sign up
            </Link>
          </Typography>
        </Stack>
      </form>
    </FormProvider>
  )
}
