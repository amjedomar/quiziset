import { FormInput } from '@/ui/form-fields/form-input'
import { FormCheckbox } from '@/ui/form-fields/form-checkbox'
import { FormRadio } from '@/ui/form-fields/form-radio'
import { FormFieldError } from '@/ui/form-fields/form-field-error'
import { SortableAnswerRow } from '@/components/quiz/quiz-question-form/sortable-answer-row'
import { FormControl, FormLabel, IconButton, Sheet, Stack } from '@mui/joy'
import DeleteIcon from '@mui/icons-material/Delete'
import styles from './quiz-question-form.module.scss'
import { QuestionType, QuestionTypeSelect } from '@/components/quiz/question-type-select'
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react'
import { isSortableOperation } from '@dnd-kit/react/sortable'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useCallback, useEffect, useRef, useState } from 'react'

interface QuizQuestionFormProps {
  questionFieldName: string
  onDelete: () => void
  index: number
  disableDeletion?: boolean
}

export function QuizQuestionForm({ questionFieldName, onDelete, index, disableDeletion }: QuizQuestionFormProps) {
  const { control, setValue } = useFormContext()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [newAnswerFocusIndex, setNewAnswerFocusIndex] = useState<number | null>(null)

  const questionType = useWatch({
    control,
    name: `${questionFieldName}.questionType`,
  })

  const isCheckboxOrRadioQuestion = questionType === QuestionType.Checkbox || questionType === QuestionType.Radio
  const isReorderQuestion = questionType === QuestionType.Reorder

  const {
    fields: answers,
    append,
    move,
    remove,
  } = useFieldArray({
    control,
    name: `${questionFieldName}.answers`,
  })

  useEffect(() => {
    if (newAnswerFocusIndex === null) {
      return
    }

    inputRefs.current[newAnswerFocusIndex]?.focus()
    setNewAnswerFocusIndex(null)
  }, [newAnswerFocusIndex, answers.length])

  const handleAnswerKeyDown = useCallback(
    (answerIndex: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value

      if (event.key === 'ArrowUp' && answerIndex > 0) {
        event.preventDefault()
        inputRefs.current[answerIndex - 1]?.focus()
        return
      }

      if (event.key === 'ArrowDown' && answerIndex < answers.length - 1) {
        event.preventDefault()
        inputRefs.current[answerIndex + 1]?.focus()
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        append({ text: '' })
        setNewAnswerFocusIndex(answerIndex + 1)
        return
      }

      if (event.key === 'Backspace' && value === '' && answers.length > 2) {
        event.preventDefault()
        const focusIndex = answerIndex === 0 ? 1 : answerIndex - 1
        const inputToFocus = inputRefs.current[focusIndex]
        remove(answerIndex)
        inputToFocus?.focus()
      }
    },
    [answers.length, append, remove],
  )

  const handleAnswerDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.canceled || !isSortableOperation(event.operation)) {
        return
      }

      const source = event.operation.source
      if (!source) {
        return
      }

      const fromIndex = source.initialIndex
      const toIndex = source.index

      if (fromIndex === toIndex) {
        return
      }

      move(fromIndex, toIndex)
    },
    [move],
  )

  const renderAnswerRowContent = useCallback(
    (answerIndex: number) => (
      <>
        <div className={styles.answerInput}>
          <FormInput
            name={`${questionFieldName}.answers.${answerIndex}.text`}
            placeholder={`Answer ${answerIndex + 1}`}
            inputRef={(element) => {
              inputRefs.current[answerIndex] = element
            }}
            slotProps={{
              input: {
                onKeyDown: (event) => handleAnswerKeyDown(answerIndex, event),
              },
            }}
          />
        </div>

        <IconButton
          color="danger"
          size="sm"
          sx={{ ml: 0.75 }}
          disabled={answers.length <= 2}
          onClick={() => remove(answerIndex)}
          tabIndex={-1}
        >
          <DeleteIcon />
        </IconButton>
      </>
    ),
    [answers.length, handleAnswerKeyDown, questionFieldName, remove],
  )

  const handleRadioSelect = useCallback(
    (answerIndex: number) => {
      answers.forEach((_, currentIndex) => {
        setValue(`${questionFieldName}.answers.${currentIndex}.isCorrect`, currentIndex === answerIndex)
      })
    },
    [answers, questionFieldName, setValue],
  )

  return (
    <Sheet className={styles.sheet} sx={{ boxShadow: 'md' }} style={{ padding: 0 }}>
      <div className={styles.header}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <span>#{index + 1}</span>
          <QuestionTypeSelect formFieldName={`${questionFieldName}.questionType`} />
        </Stack>

        <IconButton color="danger" onClick={onDelete} disabled={disableDeletion}>
          <DeleteIcon />
        </IconButton>
      </div>

      <Stack sx={{ p: 2 }} spacing={2}>
        <FormInput name={`${questionFieldName}.title`} label="Question Title"></FormInput>

        <FormControl>
          <Stack spacing={1}>
            <FormLabel>Answers</FormLabel>

            {isReorderQuestion ? (
              <DragDropProvider onDragEnd={handleAnswerDragEnd}>
                <Stack spacing={1}>
                  {answers.map((answer, answerIndex) => (
                    <SortableAnswerRow key={answer.id} id={answer.id} index={answerIndex}>
                      {renderAnswerRowContent(answerIndex)}
                    </SortableAnswerRow>
                  ))}
                </Stack>
              </DragDropProvider>
            ) : (
              answers.map((answer, answerIndex) => (
                <Stack key={answer.id} direction="row" alignItems="flex-start" spacing={1}>
                  {isCheckboxOrRadioQuestion && (
                    <div className={styles.correctSelector}>
                      {questionType === QuestionType.Checkbox ? (
                        <FormCheckbox
                          name={`${questionFieldName}.answers.${answerIndex}.isCorrect`}
                          slotProps={{ input: { tabIndex: -1 } }}
                        />
                      ) : (
                        <FormRadio
                          name={`${questionFieldName}.answers.${answerIndex}.isCorrect`}
                          slotProps={{ input: { tabIndex: -1 } }}
                          onChange={() => handleRadioSelect(answerIndex)}
                        />
                      )}
                    </div>
                  )}

                  {renderAnswerRowContent(answerIndex)}
                </Stack>
              ))
            )}
          </Stack>

          <FormFieldError name={`${questionFieldName}.answers`} />
        </FormControl>
      </Stack>
    </Sheet>
  )
}
