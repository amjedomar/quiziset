import { Checkbox, Sheet, Stack } from '@mui/joy'
import { QuestionRendererProps } from '@/components/quiz/quiz-session/quiz-question'
import styles from './checkbox-question.module.scss'

export function CheckboxQuestion({ answers, value, onChange }: QuestionRendererProps) {
  const toggle = (index: number) => {
    onChange(value.includes(index) ? value.filter((selected) => selected !== index) : [...value, index])
  }

  return (
    <Stack spacing={1}>
      {answers.map((answer, index) => (
        <Sheet key={index} variant="outlined" className={styles.item}>
          <Checkbox overlay label={answer.text} checked={value.includes(index)} onChange={() => toggle(index)} />
        </Sheet>
      ))}
    </Stack>
  )
}
