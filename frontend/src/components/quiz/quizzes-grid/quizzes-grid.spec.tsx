import { render } from '@testing-library/react'
import { makeQuiz } from '@/test-utils/mocks'
import { QuizzesGrid } from './quizzes-grid'

jest.mock('@/constants/api-url', () => ({
  NEXT_PUBLIC_API_BASE_URL: 'http://mock-backend',
}))

jest.mock('@/components/quiz/favorite-button', () => ({
  FavoriteButton: () => null,
}))

describe('QuizzesGrid', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<QuizzesGrid quizzes={[makeQuiz()]} isLoading={false} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders a card with a link to the quiz overview for each quiz', () => {
    const { getByText, getByRole } = render(<QuizzesGrid quizzes={[makeQuiz({ id: 5 })]} isLoading={false} />)

    expect(getByText('JS Basics')).toBeInTheDocument()
    expect(getByRole('link')).toHaveAttribute('href', '/quizzes/5/overview')
  })

  it('shows an empty message when there are no quizzes', () => {
    const { getByText } = render(<QuizzesGrid quizzes={[]} isLoading={false} />)

    expect(getByText('No quizzes found')).toBeInTheDocument()
  })
})
