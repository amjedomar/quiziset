'use client'
import { Box, Button, FormControl, FormLabel, Input, Stack, Typography } from '@mui/joy'
import { useLogin } from '@/api-client/auth'
import { useForm } from 'react-hook-form'
import { LoginDto } from '@/api-client/model'

export default function LoginForm() {
  const { register, handleSubmit } = useForm<LoginDto>()

  const { mutateAsync: login, isPending } = useLogin()

  const onSubmit = async (payload: LoginDto) => {
    const {
      data: { accessToken },
    } = await login({ data: payload })

    console.log('debugging accessToken', accessToken)
  }

  return (
    <Box
      sx={{
        boxShadow: 'md',
        padding: 2,
        borderRadius: 6,
        border: '1px solid #e0e0e0',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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

          <Button type="submit" loading={isPending}>
            Login
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
