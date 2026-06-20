import { Radio, RadioGroup, Sheet, Stack } from '@mui/joy'
import { QuestionRendererProps } from '@/components/quiz/quiz-session/quiz-question'

export function RadioQuestion({ answers, value, onChange }: QuestionRendererProps) {
  // radio questions can only have a single selected answer
  const selectedIndex = value[0]

  return (
    <RadioGroup
      value={typeof selectedIndex === 'number' ? String(selectedIndex) : ''}
      onChange={(event) => onChange([Number(event.target.value)])}
    >
      <Stack spacing={1}>
        {answers.map((answer, index) => (
          <Sheet key={index} variant="outlined" sx={{ borderRadius: 'sm', p: 1.5 }}>
            <Radio value={String(index)} label={answer.text} />
          </Sheet>
        ))}
      </Stack>
    </RadioGroup>
  )
}
