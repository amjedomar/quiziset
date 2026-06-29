import { Chip } from '@mui/joy'

interface SessionStatusChipProps {
  isFinished: boolean
}

export function SessionStatusChip({ isFinished }: SessionStatusChipProps) {
  return (
    <Chip variant="soft" size="sm" color={isFinished ? 'success' : 'warning'}>
      {isFinished ? 'Finished' : 'Ongoing'}
    </Chip>
  )
}
