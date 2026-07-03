import { render } from '@testing-library/react'
import Home from './page'

const Homepage = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="homepage-component" />)
jest.mock('@/components/homepage', () => ({
  Homepage: (props: unknown) => Homepage(props),
}))

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  dehydrate: () => ({}),
  HydrationBoundary: ({ children }: { children: React.ReactNode }) => children,
}))

const prefetchGetAllQuizzesQuery = jest.fn()
jest.mock('@/generated-api-client/quiz', () => ({
  prefetchGetAllQuizzesQuery: (...args: unknown[]) => prefetchGetAllQuizzesQuery(...args),
}))

describe('Home', () => {
  const prefetchQuery = {
    page: 1,
    sortBy: 'popularity',
    sortOrder: 'desc',
  }

  it('prefetches the first page of quizzes sorted by most popular', async () => {
    render(await Home())

    expect(prefetchGetAllQuizzesQuery).toHaveBeenCalledWith(expect.anything(), prefetchQuery)
  })

  it('renders the homepage component (with the first page of quizzes sorted by most popular)', async () => {
    const { getByTestId } = render(await Home())

    expect(getByTestId('homepage-component')).toBeInTheDocument()
    expect(Homepage).toHaveBeenCalledWith({ initialParams: prefetchQuery })
  })
})
