import { Radio, RadioGroup, Sheet, Stack } from '@mui/joy'
import { QuestionRendererProps } from '@/components/quiz/quiz-session/quiz-question'
import styles from './radio-question.module.scss'

export function RadioQuestion({ answers, value, onChange }: QuestionRendererProps) {
  // radio questions can only have a single selected answer
  const selectedIndex = value[0]

  return (
    <RadioGroup
      overlay
      value={typeof selectedIndex === 'number' ? String(selectedIndex) : ''}
      onChange={(event) => onChange([Number(event.target.value)])}
    >
      <Stack spacing={1}>
        {answers.map((answer, index) => (
          <Sheet key={index} variant="outlined" className={styles.item}>
            <Radio value={String(index)} label={answer.text} />
          </Sheet>
        ))}
      </Stack>
    </RadioGroup>
  )
}
