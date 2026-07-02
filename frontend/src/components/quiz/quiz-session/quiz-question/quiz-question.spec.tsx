import { render } from '@testing-library/react'
import { makeQuizSessionQuestion } from '@/test-utils/mocks'
import { QuizQuestion } from './quiz-question'

jest.mock('@/constants/api-url', () => ({
  NEXT_PUBLIC_API_BASE_URL: 'http://mock-backend',
}))

jest.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => children,
}))
jest.mock('@dnd-kit/react/sortable', () => ({
  useSortable: () => ({ ref: null, handleRef: jest.fn(), isDragging: false }),
}))
jest.mock('@dnd-kit/helpers', () => ({
  move: jest.fn(),
}))

describe('QuizQuestion', () => {
  it('correctly renders a question-checkbox question', () => {
    const question = makeQuizSessionQuestion('question-checkbox')
    const { asFragment } = render(<QuizQuestion question={question} value={[]} onChange={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('correctly renders a question-radio question', () => {
    const question = makeQuizSessionQuestion('question-radio')
    const { asFragment } = render(<QuizQuestion question={question} value={[]} onChange={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('correctly renders a question-cards question', () => {
    const question = makeQuizSessionQuestion('question-cards')
    const { asFragment } = render(<QuizQuestion question={question} value={[]} onChange={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('correctly renders a question-reorder question', () => {
    const question = makeQuizSessionQuestion('question-reorder')
    const { asFragment } = render(<QuizQuestion question={question} value={[0, 1, 2]} onChange={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
