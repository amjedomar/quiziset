import { FormFieldCore } from '@/ui/form-fields/form-field-core'
import { SelectEnhanced, SelectEnhancedProps } from '@/ui/select-enhanced'

interface FormSelectProps<Multiple extends boolean> extends Omit<SelectEnhancedProps<Multiple>, 'defaultValue'> {
  name: string
  label?: string
  defaultValue?: string | number | null
}

export function FormSelect<Multiple extends boolean>({
  name,
  label,
  placeholder,
  options,
  decoratorStyle,
  defaultValue = '',
  ...selectProps
}: FormSelectProps<Multiple>) {
  return (
    <FormFieldCore
      name={name}
      label={label}
      defaultValue={defaultValue}
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
