import { AspectRatio, Card, CardContent, CardOverflow, Stack, Typography } from '@mui/joy'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { QuestionRendererProps } from '@/components/quiz/quiz-session/quiz-question'
import { BackendImage } from '@/ui/backend-image'
import styles from './cards-question.module.scss'

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
    <div className={styles.grid}>
      {answers.map((answer, index) => {
        const isSelected = value.includes(index)

        return (
          <Card
            key={index}
            data-testid={`question-cards-answer-${index}`}
            variant={isSelected ? 'solid' : 'outlined'}
            color={isSelected ? 'primary' : 'neutral'}
            onClick={() => toggle(index)}
            className={styles.card}
          >
            <CardOverflow>
              <AspectRatio ratio="1" className={styles.image}>
                {answer.imageUrl && <BackendImage src={answer.imageUrl} alt={answer.text} />}
              </AspectRatio>
            </CardOverflow>

            <CardContent>
              <Stack direction="row" sx={{ gap: 1 }}>
                {isSelected ? (
                  <CheckCircleIcon className={styles.icon} />
                ) : (
                  <RadioButtonUncheckedIcon className={styles.icon} />
                )}
                <Typography textColor="inherit">{answer.text}</Typography>
              </Stack>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
