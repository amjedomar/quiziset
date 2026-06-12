import { Checkbox, CheckboxProps } from '@mui/joy'
import { FormControlField } from '@/ui/form-fields/form-control-field'

interface FormCheckboxProps extends Omit<CheckboxProps, 'checked' | 'onChange'> {
  name: string
  label?: string
  disableErrorState?: boolean
}

export function FormCheckbox({ name, label, disableErrorState, ...checkboxProps }: FormCheckboxProps) {
  return (
    <FormControlField
      name={name}
      label={label}
      defaultValue={false}
      renderField={({ field: { value, onChange, ref, ...fieldProps } }) => (
        <Checkbox
          {...checkboxProps}
          {...fieldProps}
          checked={!!value}
          onChange={(event) => onChange(event.target.checked)}
          slotProps={{ input: { ref } }}
        />
      )}
      disableErrorState={disableErrorState}
    />
  )
}
