import { Radio, RadioProps } from '@mui/joy'
import { FormFieldCore } from '@/ui/form-fields/form-field-core'

interface FormRadioProps extends Omit<RadioProps, 'checked' | 'onChange'> {
  name: string
  label?: string
  onChange?: RadioProps['onChange']
  disableErrorState?: boolean
}

export function FormRadio({ name, label, onChange, disableErrorState, ...radioProps }: FormRadioProps) {
  return (
    <FormFieldCore
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
