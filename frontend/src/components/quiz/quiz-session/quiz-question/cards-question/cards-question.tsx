import { AspectRatio, Box, Card, CardContent, CardOverflow, Stack, Typography } from '@mui/joy'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { QuestionRendererProps } from '@/components/quiz/quiz-session/quiz-question'
import { BackendImage } from '@/ui/backend-image'

/**
 * "question-cards" is answered by selecting the cards the user thinks are correct
 *   - they are displayed as cards (with image and text)
 *   - user can select multiple answers
 */
export function CardsQuestion({ answers, value, onChange }: QuestionRendererProps) {
  const toggle = (index: number) => {
    onChange(value.includes(index) ? value.filter((selected) => selected !== index) : [...value, index])
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, minmax(0, 1fr))',
        },
      }}
    >
      {answers.map((answer, index) => {
        const isSelected = value.includes(index)

        return (
          <Card
            key={index}
            variant={isSelected ? 'solid' : 'outlined'}
            color={isSelected ? 'primary' : 'neutral'}
            onClick={() => toggle(index)}
            // I set borderWidth to avoid width/height changing when variant is switched
            sx={{ cursor: 'pointer', borderWidth: 1, borderStyle: 'solid' }}
          >
            <CardOverflow>
              <AspectRatio ratio="1">
                {answer.imageUrl && <BackendImage src={answer.imageUrl} alt={answer.text} />}
              </AspectRatio>
            </CardOverflow>

            <CardContent>
              <Stack direction="row" spacing={1}>
                {isSelected ? (
                  <CheckCircleIcon style={{ marginTop: 5 }} />
                ) : (
                  <RadioButtonUncheckedIcon style={{ marginTop: 5 }} />
                )}
                <Typography textColor="inherit">{answer.text}</Typography>
              </Stack>
            </CardContent>
          </Card>
        )
      })}
    </Box>
  )
}
