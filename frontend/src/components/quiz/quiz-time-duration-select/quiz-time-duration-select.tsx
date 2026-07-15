import { FormFieldCore } from '@/ui/form-fields/form-field-core'
import { SelectEnhanced, SelectEnhancedOption } from '@/ui/select-enhanced'

/**
 * mui/joy have internal issue (when "null" is passed as a default value
 * then menu doesn't close when user clicks outside it (if there is no
 * selected option i.e. null)
 *
 * Thus, instead use 'none' then map it to `null` when `onChange`
 */
const NO_LIMIT = 'none'

/**
 * builds the list of durations (in minutes)
 * - starts with 1, 2, 3, 4, 5
 * - then 15
 * - then steps by 15 until it reaches 3 hrs (180 mins)
 */
const buildDurationMinutes = (): number[] => {
  const minutes = [1, 2, 3, 4, 5, 15]

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
  { label: 'No Time Limit', value: NO_LIMIT },
  ...buildDurationMinutes().map((minutes) => ({ label: formatDuration(minutes), value: minutes })),
]

interface QuizTimeDurationSelectProps {
  name: string // fieldName in form
}

export function QuizTimeDurationSelect({ name }: QuizTimeDurationSelectProps) {
  return (
    <FormFieldCore
      name={name}
      label="Time Duration (hr:min)"
      defaultValue={null}
      renderField={({ field: { ref, name: fieldName, value, onChange } }) => (
        <SelectEnhanced
          ref={ref}
          name={fieldName}
          value={value ?? NO_LIMIT}
          onChange={(_, newValue) => onChange(newValue === NO_LIMIT ? null : newValue)}
          options={TIME_DURATION_OPTIONS}
          placeholder=""
          style={{ width: 160 }}
          testId={`select-${name}`}
        />
      )}
    />
  )
}
