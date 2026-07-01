import { Radio, RadioProps } from '@mui/joy'
import { FormFieldCore } from '@/ui/form-fields/form-field-core'

interface FormRadioProps extends Omit<RadioProps, 'checked' | 'onChange'> {
  name: string
  label?: string
  /**
   * In case of Radio the onChange event must be handled by the parent component
   * Because in group of radios, only one radio should be selected at a time
   *
   * Here we make sure this prop is required
   */
  onChange: RadioProps['onChange']
  disableErrorState?: boolean
}

export function FormRadio({ name, label, disableErrorState, onChange, slotProps, ...radioProps }: FormRadioProps) {
  return (
    <FormFieldCore
      name={name}
      label={label}
      defaultValue={false}
      disableErrorState={disableErrorState}
      renderField={({ field: { value, ...fieldProps } }) => (
        <Radio
          {...radioProps}
          {...fieldProps}
          onChange={onChange}
          checked={!!value}
          slotProps={{ ...slotProps, input: { ...slotProps?.input, 'data-testid': `radio-${name}` } }}
        />
      )}
    />
  )
}
