import { FormInput } from '@/ui/form-fields/form-input'
import { IconButton, Sheet, Stack } from '@mui/joy'
import { FormSelect, FormSelectOption } from '@/ui/form-fields/form-select'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import ReorderIcon from '@mui/icons-material/Loop'
import DeleteIcon from '@mui/icons-material/Delete'
import styles from './quiz-question-form.module.scss'

interface QuizQuestionFormProps {
  questionFieldName: string
  onDelete: () => void
  index: number
  disableDeletion?: boolean
}

const QUESTION_TYPES: FormSelectOption[] = [
  { label: 'Checkbox', value: 'checkbox', decorator: <CheckBoxOutlinedIcon fontSize="inherit" /> },
  { label: 'Radio', value: 'radio', decorator: <RadioButtonCheckedIcon fontSize="inherit" /> },
  { label: 'Reorder', value: 'reorder', decorator: <ReorderIcon fontSize="inherit" /> },
]

export default function QuizQuestionForm({
  questionFieldName,
  onDelete,
  index,
  disableDeletion,
}: QuizQuestionFormProps) {
  return (
    <Sheet className={styles.sheet} sx={{ boxShadow: 'md' }} style={{ padding: 0 }}>
      <div className={styles.header}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <span>#{index + 1}</span>
          <FormSelect
            style={{ width: 150 }}
            name={`${questionFieldName}.questionType`}
            options={QUESTION_TYPES}
            decoratorStyle={{ minWidth: 27, fontSize: 20 }}
          />
        </Stack>

        <IconButton color="danger" onClick={onDelete} disabled={disableDeletion}>
          <DeleteIcon />
        </IconButton>
      </div>

      <Stack sx={{ p: 2 }} spacing={2}>
        <FormInput name={`${questionFieldName}.title`} label="Question Title"></FormInput>
      </Stack>
    </Sheet>
  )
}
