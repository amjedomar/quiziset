import { fireEvent } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { makeQuizQuestion } from '@/test-utils/mocks'
import { QuizQuestionForm } from './question-form'

jest.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => children,
}))
jest.mock('@dnd-kit/react/sortable', () => ({
  useSortable: () => ({ ref: null, handleRef: jest.fn(), isDragging: false }),
  isSortableOperation: () => false,
}))

describe('QuizQuestionForm', () => {
  const defaultValues = { questions: [makeQuizQuestion('question-checkbox')] }

  it('correctly renders', () => {
    const { asFragment } = renderWithFormContext(
      <QuizQuestionForm questionFieldName="questions.0" onDelete={jest.fn()} index={0} />,
      defaultValues,
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('updates the form value when an answer is typed into', () => {
    const { getByTestId, formMethods } = renderWithFormContext(
      <QuizQuestionForm questionFieldName="questions.0" onDelete={jest.fn()} index={0} />,
      defaultValues,
    )

    fireEvent.change(getByTestId('input-questions.0.answers.0.text'), { target: { value: 'Vienna' } })

    expect(formMethods.getValues('questions.0.answers.0.text')).toBe('Vienna')
  })

  it('adds a new answer when Enter is pressed in an answer input', () => {
    const { getByTestId, formMethods } = renderWithFormContext(
      <QuizQuestionForm questionFieldName="questions.0" onDelete={jest.fn()} index={0} />,
      defaultValues,
    )

    expect(formMethods.getValues('questions.0.answers')).toHaveLength(2) // by default there is 2 answers

    fireEvent.keyDown(getByTestId('input-questions.0.answers.0.text'), { key: 'Enter' })

    expect(formMethods.getValues('questions.0.answers')).toHaveLength(3) // they should be 3 (after Enter is pressed)
  })
})
