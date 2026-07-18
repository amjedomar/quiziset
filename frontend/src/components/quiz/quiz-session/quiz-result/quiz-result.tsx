import { Button, Card, Stack, Typography } from '@mui/joy'
import { AppLink } from '@/ui/app-link'
import { QuizSessionStateEntity } from '@/generated-api-client/model'

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

        <Button
          data-testid="back-to-quiz-overview-link"
          component={AppLink}
          href={`/quizzes/${quizId}/overview`}
          sx={{ mt: 2 }}
        >
          Back to Quiz Overview
        </Button>
      </Stack>
    </Card>
  )
}
