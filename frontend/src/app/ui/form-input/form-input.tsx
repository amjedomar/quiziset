import { Input, InputProps } from '@mui/joy'
import { FormField } from '@/app/ui/form-field'

interface FormInputProps extends InputProps {
  name: string
  label: string
}

export function FormInput({ name, label, placeholder, slotProps, ...inputProps }: FormInputProps) {
  return (
    <FormField
      name={name}
      label={label}
      defaultValue=""
      renderField={({ field: { ref, ...fieldProps } }) => (
        <Input
          {...inputProps}
          {...fieldProps}
          placeholder={placeholder ?? label}
          slotProps={{
            ...slotProps,
            input: { ...slotProps?.input, ref },
          }}
        />
      )}
    />
  )
}
