import { FormHelperText } from '@mui/joy'
import { useFormContext, useFormState } from 'react-hook-form'

interface FormFieldErrorProps {
  name: string
}

/**
 * Displays the validation error message for the given attribute name.
 *
 * It is perferred to use this component instead of calling
 * useFormState/getFieldState directly in parent component
 * because this way it avoid unnecessary re-renders in the parent component
 *
 * But use it only for general fields only (e.g. an "answers" array that requires at least one correct answer)
 *
 * However, for error that is related to a single input only
 * Then use the "FormFieldCore" component instead (as it automatically handles the error message for the input)
 */
export function FormFieldError({ name }: FormFieldErrorProps) {
  const { getFieldState } = useFormContext()
  const fieldFormState = useFormState({ name })
  const { error } = getFieldState(name, fieldFormState)
  const errorMessage = error?.root?.message ?? error?.message

  if (!errorMessage) {
    return null
  }

  return <FormHelperText sx={{ color: 'danger.500', fontWeight: 700 }}>{errorMessage}</FormHelperText>
}
