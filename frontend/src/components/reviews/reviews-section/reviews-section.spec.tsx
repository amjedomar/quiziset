import { render } from '@testing-library/react'
import { ReviewEntity } from '@/generated-api-client/model'
import { ReviewsSection } from './reviews-section'

const reviews: ReviewEntity[] = [
  {
    id: 1,
    rating: 5,
    comment: 'Loved it',
    author: { id: 1, name: 'Amjed Omar', imageUrl: null },
    isMine: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    rating: 3,
    comment: 'It was ok',
    author: { id: 2, name: 'Nadia', imageUrl: null },
    isMine: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
]

let getQuizReviewsResult = { data: { data: reviews }, isLoading: false }

jest.mock('@/generated-api-client/review', () => ({
  useGetQuizReviews: () => getQuizReviewsResult,
  useDeleteReview: () => ({ mutateAsync: jest.fn(), isPending: false }),
}))

describe('ReviewsSection', () => {
  beforeEach(() => {
    getQuizReviewsResult = { data: { data: reviews }, isLoading: false }
  })

  it('correctly renders', () => {
    const { asFragment } = render(<ReviewsSection quizId={1} canReview={false} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders the average rating and review count and the list of reviews', () => {
    const { getByText } = render(<ReviewsSection quizId={1} canReview={false} />)

    expect(getByText('4.0')).toBeInTheDocument()
    expect(getByText('2 reviews')).toBeInTheDocument()
    expect(getByText('Amjed Omar')).toBeInTheDocument()
  })
})
