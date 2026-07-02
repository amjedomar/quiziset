import { render } from '@testing-library/react'
import { makeQuizSessionQuestion } from '@/test-utils/mocks'
import { ReorderQuestion } from './reorder-question'

jest.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => children,
}))
jest.mock('@dnd-kit/react/sortable', () => ({
  useSortable: () => ({ ref: null, handleRef: jest.fn(), isDragging: false }),
}))
jest.mock('@dnd-kit/helpers', () => ({
  move: jest.fn(),
}))

const { answers } = makeQuizSessionQuestion('question-reorder')

describe('ReorderQuestion', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<ReorderQuestion answers={answers} value={[0, 1, 2]} onChange={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders the answers in the order given by value', () => {
    const { container } = render(<ReorderQuestion answers={answers} value={[2, 0, 1]} onChange={jest.fn()} />)

    const renderedTestIds = [...container.querySelectorAll('[data-testid^="question-reorder-answer-"]')].map((row) =>
      row.getAttribute('data-testid'),
    )

    expect(renderedTestIds).toEqual([
      'question-reorder-answer-2',
      'question-reorder-answer-0',
      'question-reorder-answer-1',
    ])
  })
})
