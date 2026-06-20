import { Button, Card, Stack, Typography } from '@mui/joy'
import NextLink from 'next/link'
import { QuizSessionStateEntity } from '@/api-client/model'

interface QuizResultProps {
  state: QuizSessionStateEntity
  quizId: number
}

export function QuizResult({ state, quizId }: QuizResultProps) {
  return (
    <Card variant="soft" sx={{ my: 4, p: 4 }}>
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Typography level="h3">Quiz completed!</Typography>

        <Typography level="h1" textColor="primary.500">
          {state.successfulAnswersCount} / {state.questionsCount}
        </Typography>

        <Typography level="body-md" textColor="text.tertiary">
          correct answers
        </Typography>

        <Button component={NextLink} href={`/quizzes/${quizId}/view`} sx={{ mt: 2 }}>
          Back to Quiz
        </Button>
      </Stack>
    </Card>
  )
}
