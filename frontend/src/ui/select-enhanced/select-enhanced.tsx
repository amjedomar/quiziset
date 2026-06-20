import { ListItemDecorator, Option, Select, SelectOption, SelectProps } from '@mui/joy'
import { CSSProperties, ReactNode, useCallback } from 'react'
import { SelectValue } from '@mui/base/useSelect'

export interface SelectEnhancedOption {
  label: string
  value: string | number | null
  decorator?: ReactNode
}

export interface SelectEnhancedProps<Multiple extends boolean> extends SelectProps<string, Multiple> {
  options: SelectEnhancedOption[]
  decoratorStyle?: CSSProperties
  hideSelectedOptionLabel?: boolean
}

/**
 * This Select extends mui/joy's Select by making it easier to pass decorator
 *
 * It is named SelectEnhanced so it isn't confused with 's Select
 */
export function SelectEnhanced<Multiple extends boolean>({
  options,
  decoratorStyle,
  hideSelectedOptionLabel,
  ...selectProps
}: SelectEnhancedProps<Multiple>) {
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
          {!hideSelectedOptionLabel && selectedOption.label}
        </>
      )
    },
    [options, decoratorStyle, hideSelectedOptionLabel],
  )

  /**
   * Unfortunately, there is a bug in mui joy
   * in which the initial selected value isn't rendered during SSR
   *
   * see https://github.com/mui/base-ui/issues/37
   * check the comment:
   * "It's because useSelect uses the internal useCompound hook
   * which relies on useEffect so it won't work with SSR"
   *
   * But this isn't a critical issue (since anyway selected option will be
   * shown once hydration happens in browser side)
   */
  return (
    <Select {...selectProps} renderValue={renderSelectedOption}>
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.decorator && <ListItemDecorator style={decoratorStyle}>{option.decorator}</ListItemDecorator>}

          {option.label}
        </Option>
      ))}
    </Select>
  )
}
