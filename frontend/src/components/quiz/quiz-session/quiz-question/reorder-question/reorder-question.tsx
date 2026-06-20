import { Sheet, Stack, Typography } from '@mui/joy'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import { Sortable } from '@/ui/sortable'
import { QuestionRendererProps } from '@/components/quiz/quiz-session/quiz-question'
import styles from './reorder-question.module.scss'

/**
 * "question-reorder" is answered by dragging the answers into the correct order
 * "value" is the indexes of answers arranged in the chosen order
 */
export function ReorderQuestion({ answers, value, onChange }: QuestionRendererProps) {
  return (
    <DragDropProvider onDragEnd={(event) => onChange((answers) => move(answers, event))}>
      <Stack spacing={1}>
        {value.map((answerIndex, position) => (
          <Sortable key={answerIndex} id={String(answerIndex)} index={position}>
            <Sheet variant="outlined" className={styles.row}>
              <DragIndicatorIcon fontSize="small" style={{ opacity: 0.5 }} />
              <Typography>{answers[answerIndex].text}</Typography>
            </Sheet>
          </Sortable>
        ))}
      </Stack>
    </DragDropProvider>
  )
}
