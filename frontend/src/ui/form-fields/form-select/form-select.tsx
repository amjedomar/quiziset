import { ListItemDecorator, Option, Select, SelectOption, SelectProps } from '@mui/joy'
import { FormControlField } from '@/ui/form-fields/form-control-field'
import { CSSProperties, ReactNode, useCallback } from 'react'
import { SelectValue } from '@mui/base/useSelect'

export interface FormSelectOption {
  label: string
  value: string
  decorator?: ReactNode
}

interface FormSelectProps {
  name: string
  label?: string
  options: FormSelectOption[]
  decoratorStyle?: CSSProperties
}

export function FormSelect<Multiple extends boolean>({
  name,
  label,
  placeholder,
  options,
  decoratorStyle,
  ...selectProps
}: SelectProps<string, Multiple> & FormSelectProps) {
  const renderSelectedOption = useCallback(
    (selectedOption: SelectValue<SelectOption<string>, Multiple>) => {
      if (!selectedOption) {
        return null
      }

      if (Array.isArray(selectedOption)) {
        return selectedOption.join(', ')
      }

      const decorator = options.find((option) => option.value === selectedOption.value)?.decorator

      return (
        <>
          {decorator && <ListItemDecorator style={decoratorStyle}>{decorator}</ListItemDecorator>}
          {selectedOption.label}
        </>
      )
    },
    [options, decoratorStyle],
  )

  return (
    <FormControlField
      name={name}
      label={label}
      defaultValue=""
      renderField={({ field: { ref, onChange, ...fieldProps } }) => (
        <Select
          ref={ref}
          {...fieldProps}
          {...selectProps}
          placeholder={placeholder ?? label}
          renderValue={renderSelectedOption}
          onChange={(_, value) => onChange(value)}
        >
          {options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.decorator && <ListItemDecorator style={decoratorStyle}>{option.decorator}</ListItemDecorator>}

              {option.label}
            </Option>
          ))}
        </Select>
      )}
    />
  )
}
