import { FormSelect } from '@/ui/form-fields/form-select'
import { SelectEnhancedOption } from '@/ui/select-enhanced'

/**
 * builds the list of durations (in minutes)
 * - starts with 5
 * - then 15
 * - then steps by 15 until it reaches 3 hrs (180 mins)
 */
const buildDurationMinutes = (): number[] => {
  const minutes = [5, 15]

  for (let value = 30; value <= 180; value += 15) {
    minutes.push(value)
  }

  return minutes
}

/**
 * formats a duration in minutes as "HH:MM" (e.g. 90 -> "01:30")
 */
const formatDuration = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const TIME_DURATION_OPTIONS: SelectEnhancedOption[] = [
  { label: 'No Time Limit', value: null },
  ...buildDurationMinutes().map((minutes) => ({ label: formatDuration(minutes), value: minutes })),
]

interface QuizTimeDurationSelectProps {
  name: string // fieldName in form
}

export function QuizTimeDurationSelect({ name }: QuizTimeDurationSelectProps) {
  return (
    <FormSelect
      name={name}
      label="Time Duration"
      placeholder=""
      defaultValue={null}
      style={{ width: 160 }}
      options={TIME_DURATION_OPTIONS}
    />
  )
}
