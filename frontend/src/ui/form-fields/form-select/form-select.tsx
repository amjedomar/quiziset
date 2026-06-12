import { FormFieldCore } from '@/ui/form-fields/form-field-core'
import { ReactNode } from 'react'
import { SelectEnhanced, SelectEnhancedProps } from '@/ui/select-enhanced'

export interface FormSelectOption {
  label: string
  value: string
  decorator?: ReactNode
}

interface FormSelectProps<Multiple extends boolean> extends SelectEnhancedProps<Multiple> {
  name: string
  label?: string
}

export function FormSelect<Multiple extends boolean>({
  name,
  label,
  placeholder,
  options,
  decoratorStyle,
  ...selectProps
}: FormSelectProps<Multiple>) {
  return (
    <FormFieldCore
      name={name}
      label={label}
      defaultValue=""
      renderField={({ field: { ref, onChange, ...fieldProps } }) => (
        <SelectEnhanced
          ref={ref}
          {...selectProps}
          {...fieldProps}
          onChange={(_, value) => onChange(value)}
          options={options}
          decoratorStyle={decoratorStyle}
          placeholder={placeholder ?? label}
        />
      )}
    />
  )
}
