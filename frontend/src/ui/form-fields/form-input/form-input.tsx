import { Input, InputProps } from '@mui/joy'
import { FormControlField } from '@/ui/form-fields/form-control-field'
import { mergeRefs } from '@/utils/merge-refs'
import { Ref } from 'react'

interface FormInputProps extends InputProps {
  name: string
  label?: string
  inputRef?: Ref<HTMLInputElement>
}

export function FormInput({ name, label, placeholder, inputRef, slotProps, ...inputProps }: FormInputProps) {
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
            input: {
              ...slotProps?.input,
              ref: mergeRefs(ref, inputRef),
            },
          }}
        />
      )}
    />
  )
}
