import { render } from '@testing-library/react'
import QuizUpdatePage from './page'

const QuizUpdateForm = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="quiz-update-form" />)
jest.mock('@/components/quiz/quiz-update-form', () => ({
  QuizUpdateForm: (props: unknown) => QuizUpdateForm(props),
}))

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  dehydrate: () => ({}),
  HydrationBoundary: ({ children }: { children: React.ReactNode }) => children,
}))

const prefetchGetSingleQuizQuery = jest.fn()
jest.mock('@/generated-api-client/quiz', () => ({
  prefetchGetSingleQuizQuery: (...args: unknown[]) => prefetchGetSingleQuizQuery(...args),
}))

describe('QuizUpdatePage', () => {
  it('prefetches the quiz details for the quiz (matching the route quizId param)', async () => {
    render(await QuizUpdatePage({ params: Promise.resolve({ quizId: '5' }) }))

    expect(prefetchGetSingleQuizQuery).toHaveBeenCalledWith(expect.anything(), 5, { fields: 'DETAILS' })
  })

  it('renders the quiz update form for the quiz (matching the route quizId param)', async () => {
    const { getByTestId } = render(await QuizUpdatePage({ params: Promise.resolve({ quizId: '5' }) }))

    expect(getByTestId('quiz-update-form')).toBeInTheDocument()
    expect(QuizUpdateForm).toHaveBeenCalledWith({ quizId: 5 })
  })
})
