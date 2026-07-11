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
  testId?: string
}

/**
 * This Select extends mui/joy's Select by making it easier to pass decorator
 * (plus it fixes the SSR issue for preselected option check comment
 * below for more info)
 *
 * It is named SelectEnhanced so it isn't confused with mui/joy's Select
 */
export function SelectEnhanced<Multiple extends boolean>({
  options,
  decoratorStyle,
  hideSelectedOptionLabel,
  testId,
  slotProps,
  placeholder,
  ...selectProps
}: SelectEnhancedProps<Multiple>) {
  // renders the decorator + label for a single selected option
  const renderOptionContent = useCallback(
    ({ label, decorator }: { label: ReactNode; decorator?: ReactNode }) => (
      <>
        {decorator && <ListItemDecorator style={decoratorStyle}>{decorator}</ListItemDecorator>}
        {!hideSelectedOptionLabel && label}
      </>
    ),
    [decoratorStyle, hideSelectedOptionLabel],
  )

  const renderSelectedOption = useCallback(
    (selectedOption: SelectValue<SelectOption<string>, Multiple>) => {
      if (!selectedOption) {
        return null
      }

      if (Array.isArray(selectedOption)) {
        return selectedOption.map((option) => option.label).join(', ')
      }

      const matchedOption = options.find((option) => option.value === selectedOption.value)

      return renderOptionContent({
        label: matchedOption?.label ?? selectedOption.label,
        decorator: matchedOption?.decorator,
      })
    },
    [options, renderOptionContent],
  )

  /**
   * There is an internal BUG in mui/joy in which the
   * initial selected value isn't rendered during SSR
   *
   * see https://github.com/mui/base-ui/issues/37
   * check the comment:
   * "It's because useSelect uses the internal useCompound hook
   * which relies on useEffect so it won't work with SSR"
   *
   * but the workaround I did here is to pass the "placeholder" prop
   * explicity and it fixed the issue! :)
   */
  const currentValue = selectProps.value !== undefined ? selectProps.value : selectProps.defaultValue

  const preselectedOptions = (Array.isArray(currentValue) ? currentValue : [currentValue])
    .map((value) => options.find((option) => option.value === value))
    .filter((option) => typeof option !== 'undefined')

  const initialPlaceholder =
    preselectedOptions.length > 0
      ? Array.isArray(currentValue)
        ? preselectedOptions.map((option) => option.label).join(', ')
        : renderOptionContent(preselectedOptions[0])
      : placeholder

  return (
    <Select
      {...selectProps}
      placeholder={initialPlaceholder}
      renderValue={renderSelectedOption}
      slotProps={{ ...slotProps, button: { ...slotProps?.button, 'data-testid': testId } }}
    >
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.decorator && <ListItemDecorator style={decoratorStyle}>{option.decorator}</ListItemDecorator>}

          {option.label}
        </Option>
      ))}
    </Select>
  )
}
