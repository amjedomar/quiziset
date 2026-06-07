'use client'
import { Button, FormControl, FormLabel, Input, Stack, Typography } from '@mui/joy'
import { useForm } from 'react-hook-form'
import { LoginDto } from '@/api-client/model'
import { useAuth } from '@/hooks/use-auth'

export function LoginForm() {
  const { register, handleSubmit } = useForm<LoginDto>()

  const { login, isLogging } = useAuth()

  return (
    <form onSubmit={handleSubmit(login)}>
      <Stack direction="column" spacing={2}>
        <Typography level="h3" textAlign="center">
          Login
        </Typography>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input {...register('email')} placeholder="Email" type="email" />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input {...register('password')} placeholder="Password" type="password" />
        </FormControl>

        <Button type="submit" loading={isLogging}>
          Login
        </Button>
      </Stack>
    </form>
  )
}
