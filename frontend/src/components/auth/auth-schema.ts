import z from 'zod'

const email = z.string().nonempty('Email is required').pipe(z.email('Email is invalid'))

const name = z
  .string()
  .nonempty('Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(64, 'Name max length is 64 characters')

const password = z.string().nonempty('Password is required').min(8, 'Password must be at least 8 characters')

export const loginSchema = z.object({
  email,
  password,
})

export const signupSchema = z.object({
  name,
  email,
  password,
})

export const forgotPasswordSchema = z.object({
  email,
})

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().nonempty('Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const profileSchema = z.object({
  name,
  email,
})

export type LoginFormData = z.infer<typeof loginSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
