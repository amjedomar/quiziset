import { FormInput } from '@/ui/form-fields/form-input'
import { IconButton, Sheet, Stack } from '@mui/joy'
import DeleteIcon from '@mui/icons-material/Delete'
import styles from './quiz-question-form.module.scss'
import { QuestionTypeSelect } from '@/components/quiz/question-type-select'

interface QuizQuestionFormProps {
  questionFieldName: string
  onDelete: () => void
  index: number
  disableDeletion?: boolean
}

export function QuizQuestionForm({ questionFieldName, onDelete, index, disableDeletion }: QuizQuestionFormProps) {
  return (
    <Sheet className={styles.sheet} sx={{ boxShadow: 'md' }} style={{ padding: 0 }}>
      <div className={styles.header}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <span>#{index + 1}</span>
          <QuestionTypeSelect formFieldName={`${questionFieldName}.questionType`} />
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
