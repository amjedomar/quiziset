import { Input, InputProps } from '@mui/joy'
import { FormFieldCore } from '@/ui/form-fields/form-field-core'
import { mergeRefs } from '@/utils/merge-refs'
import { Ref } from 'react'
import { ControllerProps } from 'react-hook-form'

interface FormInputProps extends InputProps {
  name: string
  label?: string
  inputRef?: Ref<HTMLInputElement>
  formControlClassName?: string
  // react-hook-form validation rules (e.g. required, minLength, pattern)
  rules?: ControllerProps['rules']
}

export function FormInput({
  name,
  label,
  placeholder,
  inputRef,
  slotProps,
  formControlClassName,
  rules,
  ...inputProps
}: FormInputProps) {
  return (
    <FormFieldCore
      formControlClassName={formControlClassName}
      name={name}
      label={label}
      rules={rules}
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
              'data-testid': `input-${name}`,
            },
          }}
        />
      )}
    />
  )
}
