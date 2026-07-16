import { FormSelect } from '@/ui/form-fields/form-select'
import QuestionCheckboxIcon from '@mui/icons-material/CheckBoxOutlined'
import QuestionRadioIcon from '@mui/icons-material/RadioButtonChecked'
import QuestionReorderIcon from '@mui/icons-material/Loop'
import QuestionCardsIcon from '@mui/icons-material/PaymentsOutlined'
import { SelectEnhanced, SelectEnhancedOption, SelectEnhancedProps } from '@/ui/select-enhanced'
import { ValueOf } from '@/utils/typescript-utils'

/**
 * defined as an object (instead of a TS enum)
 * so that this "QuestionType" can be assigned to orval's generated QuestionEntityQuestionType
 */
export const QuestionType = {
  Checkbox: 'question-checkbox',
  Radio: 'question-radio',
  Reorder: 'question-reorder',
  Cards: 'question-cards',
} as const

export type QuestionType = ValueOf<typeof QuestionType>

type QuestionTypeOption = SelectEnhancedOption & { value: QuestionType }

export const QUESTION_TYPES: QuestionTypeOption[] = [
  { label: 'Checkbox', value: QuestionType.Checkbox, decorator: <QuestionCheckboxIcon fontSize="inherit" /> },
  { label: 'Radio', value: QuestionType.Radio, decorator: <QuestionRadioIcon fontSize="inherit" /> },
  { label: 'Reorder', value: QuestionType.Reorder, decorator: <QuestionReorderIcon fontSize="inherit" /> },
  { label: 'Cards', value: QuestionType.Cards, decorator: <QuestionCardsIcon fontSize="inherit" /> },
]

export function getQuestionHint(questionType: QuestionType): string {
  switch (questionType) {
    case QuestionType.Radio:
      return 'Select the correct answer'
    case QuestionType.Reorder:
      return 'Put the answers in the correct order'
    default:
      return 'Select correct answer(s)'
  }
}

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
    sx: { ...restProps.style, width: hideSelectedOptionLabel ? { md: 70, xs: 77 } : { md: 150, xs: 158 } },
    decoratorStyle: { ...restProps.decoratorStyle, minWidth: 27, fontSize: 20 },
    onChange: (_, value) => onChange?.(value as QuestionType),
  }

  return formFieldName ? (
    <FormSelect {...selectProps} name={formFieldName} />
  ) : (
    <SelectEnhanced {...selectProps} hideSelectedOptionLabel={hideSelectedOptionLabel} />
  )
}
