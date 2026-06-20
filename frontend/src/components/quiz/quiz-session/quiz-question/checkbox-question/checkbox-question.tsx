import { Checkbox, Sheet, Stack } from '@mui/joy'
import { QuestionRendererProps } from '@/components/quiz/quiz-session/quiz-question'

export function CheckboxQuestion({ answers, value, onChange }: QuestionRendererProps) {
  const toggle = (index: number) => {
    onChange(value.includes(index) ? value.filter((selected) => selected !== index) : [...value, index])
  }

  return (
    <Stack spacing={1}>
      {answers.map((answer, index) => (
        <Sheet key={index} variant="outlined" sx={{ borderRadius: 'sm', p: 1.5 }}>
          <Checkbox label={answer.text} checked={value.includes(index)} onChange={() => toggle(index)} />
        </Sheet>
      ))}
    </Stack>
  )
}
