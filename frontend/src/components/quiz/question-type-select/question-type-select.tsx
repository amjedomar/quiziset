import { FormSelect, FormSelectOption } from '@/ui/form-fields/form-select'
import QuestionCheckboxIcon from '@mui/icons-material/CheckBoxOutlined'
import QuestionRadioIcon from '@mui/icons-material/RadioButtonChecked'
import QuestionReorderIcon from '@mui/icons-material/Loop'
import QuestionCardsIcon from '@mui/icons-material/PaymentsOutlined'
import { SelectEnhanced, SelectEnhancedProps } from '@/ui/select-enhanced'

export enum QuestionType {
  Checkbox = 'question-checkbox',
  Radio = 'question-radio',
  Reorder = 'question-reorder',
  Cards = 'question-cards',
}

type QuestionTypeOption = FormSelectOption & { value: QuestionType }

export const QUESTION_TYPES: QuestionTypeOption[] = [
  { label: 'Checkbox', value: QuestionType.Checkbox, decorator: <QuestionCheckboxIcon fontSize="inherit" /> },
  { label: 'Radio', value: QuestionType.Radio, decorator: <QuestionRadioIcon fontSize="inherit" /> },
  { label: 'Reorder', value: QuestionType.Reorder, decorator: <QuestionReorderIcon fontSize="inherit" /> },
  { label: 'Cards', value: QuestionType.Cards, decorator: <QuestionCardsIcon fontSize="inherit" /> },
]

interface QuestionTypeSelectProps extends Omit<SelectEnhancedProps<false>, 'options' | 'onChange'> {
  formFieldName?: string
  onChange?: (newValue: QuestionType) => void
}

export function QuestionTypeSelect({
  formFieldName,
  onChange,
  hideSelectedOptionLabel,
  ...restProps
}: QuestionTypeSelectProps) {
  const selectProps: SelectEnhancedProps<false> = {
    ...restProps,
    options: QUESTION_TYPES,
    style: { ...restProps.style, width: hideSelectedOptionLabel ? 70 : 150 },
    decoratorStyle: { ...restProps.decoratorStyle, minWidth: 27, fontSize: 20 },
    onChange: (_, value) => onChange?.(value as QuestionType),
  }

  return formFieldName ? (
    <FormSelect {...selectProps} name={formFieldName} />
  ) : (
    <SelectEnhanced {...selectProps} hideSelectedOptionLabel={hideSelectedOptionLabel} />
  )
}
