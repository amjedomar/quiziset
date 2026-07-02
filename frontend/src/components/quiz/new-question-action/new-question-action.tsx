import { Button, Stack } from '@mui/joy'
import { QuestionType, QuestionTypeSelect } from '@/components/quiz/question-type-select'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'

interface NewQuestionActionProps {
  onCreate: (questionType: QuestionType) => void
}

export default function NewQuestionAction({ onCreate }: NewQuestionActionProps) {
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.Checkbox)

  return (
    <Stack direction="row">
      <Button
        style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
        startDecorator={<AddIcon />}
        onClick={() => onCreate(questionType)}
      >
        Question
      </Button>
      <QuestionTypeSelect
        testId="new-question-type-select"
        style={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
        value={questionType}
        onChange={setQuestionType}
        hideSelectedOptionLabel
      />
    </Stack>
  )
}
