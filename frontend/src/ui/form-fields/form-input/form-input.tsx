import { Input, InputProps } from '@mui/joy'
import { FormControlField } from '@/ui/form-fields/form-control-field'

interface FormInputProps extends InputProps {
  name: string
  label: string
}

export function FormInput({ name, label, placeholder, slotProps, ...inputProps }: FormInputProps) {
  return (
    <FormControlField
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
