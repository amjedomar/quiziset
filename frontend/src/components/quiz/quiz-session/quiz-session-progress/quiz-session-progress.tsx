import { LinearProgress, Stack, Typography } from '@mui/joy'

interface QuizSessionProgressProps {
  currentQuestionIndex: number
  questionsCount: number
}

export function QuizSessionProgress({ currentQuestionIndex, questionsCount }: QuizSessionProgressProps) {
  const percentage = questionsCount > 0 ? (currentQuestionIndex / questionsCount) * 100 : 0

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Typography level="body-sm" textColor="text.tertiary">
        Question {currentQuestionIndex + 1} of {questionsCount}
      </Typography>
      <LinearProgress determinate value={percentage} />
    </Stack>
  )
}
