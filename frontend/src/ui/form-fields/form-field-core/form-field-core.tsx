import { FormControl, FormHelperText, FormLabel } from '@mui/joy'
import { Controller, useFormContext } from 'react-hook-form'
import { ControllerProps } from 'react-hook-form'

interface FormFieldCoreProps {
  formControlClassName?: string
  name: string
  label?: string
  defaultValue: unknown
  renderField: ControllerProps['render']
  disableErrorState?: boolean
  // react-hook-form validation rules (e.g. required, minLength, pattern)
  rules?: ControllerProps['rules']
}

/**
 * This is the core component for all form fields:
 *
 * - It is used to register the field to the form context
 * - Displays label
 * - Error message is the field is invalid
 */
export function FormFieldCore({
  formControlClassName,
  name,
  label,
  renderField,
  defaultValue,
  disableErrorState,
  rules,
}: FormFieldCoreProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={(renderData) => {
        const { fieldState } = renderData
        const errorMessage = fieldState.error?.message

        return (
          <FormControl className={formControlClassName} error={!disableErrorState && fieldState.invalid}>
            {label && <FormLabel>{label}</FormLabel>}
            {renderField(renderData)}
            {!disableErrorState && errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        )
      }}
    />
  )
}
