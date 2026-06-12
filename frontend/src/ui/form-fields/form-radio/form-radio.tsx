import { Radio, RadioProps } from '@mui/joy'
import { FormControlField } from '@/ui/form-fields/form-control-field'

interface FormRadioProps extends Omit<RadioProps, 'checked' | 'onChange'> {
  name: string
  label?: string
  onChange?: RadioProps['onChange']
  disableErrorState?: boolean
}

export function FormRadio({ name, label, onChange, disableErrorState, ...radioProps }: FormRadioProps) {
  return (
    <FormControlField
      name={name}
      label={label}
      defaultValue={false}
      disableErrorState={disableErrorState}
      renderField={({ field: { value, onChange: fieldOnChange, ...fieldProps } }) => (
        <Radio
          {...radioProps}
          {...fieldProps}
          checked={!!value}
          onChange={(event) => {
            if (onChange) {
              onChange(event)
              return
            }

            fieldOnChange(true)
          }}
        />
      )}
    />
  )
}
