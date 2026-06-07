import { Textarea, TextareaProps } from '@mui/joy'
import { FormControlField } from '@/ui/form-fields/form-control-field'

interface FormTextareaProps extends TextareaProps {
  name: string
  label: string
}

export function FormTextarea({ name, label, placeholder, slotProps, ...inputProps }: FormTextareaProps) {
  return (
    <FormControlField
      name={name}
      label={label}
      defaultValue=""
      renderField={({ field: { ref, ...fieldProps } }) => (
        <Textarea
          {...inputProps}
          {...fieldProps}
          placeholder={placeholder ?? label}
          slotProps={{
            ...slotProps,
            textarea: { ...slotProps?.textarea, ref },
          }}
        />
      )}
    />
  )
}
