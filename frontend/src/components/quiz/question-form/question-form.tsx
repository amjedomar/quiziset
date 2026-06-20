import { FormInput } from '@/ui/form-fields/form-input'
import { FormCheckbox } from '@/ui/form-fields/form-checkbox'
import { FormRadio } from '@/ui/form-fields/form-radio'
import { FormFieldError } from '@/ui/form-fields/form-field-error'
import { HandleRef, Sortable } from '@/ui/sortable'
import { FormControl, FormLabel, IconButton, Sheet, Stack } from '@mui/joy'
import DeleteIcon from '@mui/icons-material/Delete'
import styles from './question-form.module.scss'
import { QuestionType, QuestionTypeSelect } from '@/components/quiz/question-type-select'
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react'
import { isSortableOperation } from '@dnd-kit/react/sortable'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FormImage } from '@/ui/form-fields/form-image'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import clsx from 'clsx'

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

  const {
    fields: answers,
    append,
    move,
    remove,
  } = useFieldArray({
    control,
    name: `${questionFieldName}.answers`,
  })

  /**
   * This useEffect is used to focus the new answer input when
   * a new answer is added via pressing the "Enter" key
   */
  useEffect(() => {
    if (newAnswerFocusIndex === null) {
      return
    }

    inputRefs.current[newAnswerFocusIndex]?.focus()
    setNewAnswerFocusIndex(null)
  }, [newAnswerFocusIndex, answers.length])

  /**
   * This callback handle shortcuts for the answer input
   */
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

  /**
   * Once the drag ends, this callback updates the order of "answers"
   * in react-hook-form (by using the "move" method)
   */
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

  /**
   * This callback renders
   * - the answer input
   * - the answer image (in case of QuestionType.Cards)
   * - the delete button
   */
  const renderAnswerRowContent = useCallback(
    (answerIndex: number) => (
      <>
        <div className={styles.answerInputWrapper}>
          {questionType === QuestionType.Cards && (
            <FormImage
              name={`${questionFieldName}.answers.${answerIndex}.imageUrl`}
              boxSize="sm"
              bucketName="quizzes"
            />
          )}

          <FormInput
            formControlClassName={styles.answerInput}
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
          disabled={answers.length <= 2}
          onClick={() => remove(answerIndex)}
          tabIndex={-1}
        >
          <DeleteIcon />
        </IconButton>
      </>
    ),
    [answers.length, handleAnswerKeyDown, questionFieldName, questionType, remove],
  )

  /**
   * Radios are a special case.
   * Their value change must be handled here (in the parent component)
   *
   * Because in group of radios, only one radio should be selected at a time
   */
  const handleRadioSelect = useCallback(
    (answerIndex: number) => {
      answers.forEach((_, currentIndex) => {
        setValue(`${questionFieldName}.answers.${currentIndex}.isCorrect`, currentIndex === answerIndex)
      })
    },
    [answers, questionFieldName, setValue],
  )

  /**
   * This callback renders the drag handle for the answer row
   */
  const renderSortableHandle = useCallback(
    (handleRef: HandleRef) => (
      <div className={clsx(styles.correctSelector, styles.dragHandle)}>
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
    ),
    [],
  )

  /**
   * This component renders the entire form for a quiz question
   */
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

            {/*
              In case no answers are selected.
              Then zod validation will set the error on the first answer's "isCorrect" field
              This is why we set the path to the first answer's "isCorrect" field
            */}
            <FormFieldError name={`${questionFieldName}.answers.0.isCorrect`} />

            {questionType === QuestionType.Reorder ? (
              <DragDropProvider onDragEnd={handleAnswerDragEnd}>
                <Stack spacing={1}>
                  {answers.map((answer, answerIndex) => (
                    <Sortable
                      className={styles.answerRow}
                      key={answer.id}
                      id={answer.id}
                      index={answerIndex}
                      renderHandle={renderSortableHandle}
                    >
                      {renderAnswerRowContent(answerIndex)}
                    </Sortable>
                  ))}
                </Stack>
              </DragDropProvider>
            ) : (
              answers.map((answer, answerIndex) => (
                <div key={answer.id} className={styles.answerRow}>
                  <div className={styles.correctSelector}>
                    {questionType === QuestionType.Radio ? (
                      <FormRadio
                        name={`${questionFieldName}.answers.${answerIndex}.isCorrect`}
                        slotProps={{ input: { tabIndex: -1 } }}
                        onChange={() => handleRadioSelect(answerIndex)}
                        disableErrorState
                      />
                    ) : (
                      <FormCheckbox
                        name={`${questionFieldName}.answers.${answerIndex}.isCorrect`}
                        slotProps={{ input: { tabIndex: -1 } }}
                        disableErrorState
                      />
                    )}
                  </div>

                  {renderAnswerRowContent(answerIndex)}
                </div>
              ))
            )}
          </Stack>
        </FormControl>
      </Stack>
    </Sheet>
  )
}
