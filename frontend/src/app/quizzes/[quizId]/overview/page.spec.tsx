import { render } from '@testing-library/react'
import QuizOverviewPage from './page'

const QuizOverview = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="quiz-overview" />)
jest.mock('@/components/quiz/quiz-overview', () => ({
  QuizOverview: (props: unknown) => QuizOverview(props),
}))

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  dehydrate: () => ({}),
  HydrationBoundary: ({ children }: { children: React.ReactNode }) => children,
}))

const prefetchGetSingleQuizQuery = jest.fn()
const prefetchGetQuizReviewsQuery = jest.fn()
jest.mock('@/generated-api-client/quiz', () => ({
  prefetchGetSingleQuizQuery: (...args: unknown[]) => prefetchGetSingleQuizQuery(...args),
}))
jest.mock('@/generated-api-client/review', () => ({
  prefetchGetQuizReviewsQuery: (...args: unknown[]) => prefetchGetQuizReviewsQuery(...args),
}))

describe('QuizOverviewPage', () => {
  it('prefetches the quiz overview and reviews for the quiz (matching the route quizId param)', async () => {
    render(await QuizOverviewPage({ params: Promise.resolve({ quizId: '5' }) }))

    expect(prefetchGetSingleQuizQuery).toHaveBeenCalledWith(expect.anything(), 5, { fields: 'OVERVIEW' })
    expect(prefetchGetQuizReviewsQuery).toHaveBeenCalledWith(expect.anything(), 5)
  })

  it('renders the quiz overview for the quiz (matching the route quizId param)', async () => {
    const { getByTestId } = render(await QuizOverviewPage({ params: Promise.resolve({ quizId: '5' }) }))

    expect(getByTestId('quiz-overview')).toBeInTheDocument()
    expect(QuizOverview).toHaveBeenCalledWith({ quizId: 5 })
  })
})
