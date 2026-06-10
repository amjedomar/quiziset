import { useSortable } from '@dnd-kit/react/sortable'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { IconButton, Stack } from '@mui/joy'
import { ReactNode } from 'react'
import styles from './quiz-question-form.module.scss'

interface SortableAnswerRowProps {
  id: string
  index: number
  children: ReactNode
}

export function SortableAnswerRow({ id, index, children }: SortableAnswerRowProps) {
  const { ref, handleRef, isDragging } = useSortable({ id, index })

  return (
    <Stack
      ref={ref}
      direction="row"
      alignItems="flex-start"
      spacing={1}
      sx={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={styles.correctSelector}>
        <IconButton
          ref={handleRef}
          size="sm"
          variant="plain"
          color="neutral"
          tabIndex={-1}
          sx={{ cursor: 'grab', mt: 0.25 }}
        >
          <DragIndicatorIcon />
        </IconButton>
      </div>
      {children}
    </Stack>
  )
}
