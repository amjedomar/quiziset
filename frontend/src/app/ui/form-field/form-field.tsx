import { FormControl, FormHelperText, FormLabel } from '@mui/joy'
import { Controller, useFormContext } from 'react-hook-form'
import { ControllerProps } from 'react-hook-form'

interface FormFieldProps {
  name: string
  label: string
  defaultValue: unknown
  renderField: ControllerProps['render']
}

export function FormField({ name, label, renderField, defaultValue }: FormFieldProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={(renderData) => {
        const { fieldState } = renderData
        const errorMessage = fieldState.error?.message

        return (
          <FormControl error={fieldState.invalid}>
            <FormLabel>{label}</FormLabel>
            {renderField(renderData)}
            {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        )
      }}
    />
  )
}
