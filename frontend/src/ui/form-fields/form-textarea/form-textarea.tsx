import { Textarea, TextareaProps } from '@mui/joy'
import { FormFieldCore } from '@/ui/form-fields/form-field-core'

interface FormTextareaProps extends TextareaProps {
  name: string
  label: string
}

export function FormTextarea({ name, label, placeholder, slotProps, ...inputProps }: FormTextareaProps) {
  return (
    <FormFieldCore
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
