import { fireEvent, render, waitFor } from '@testing-library/react'
import { ReviewForm } from './review-form'

const createReview = jest.fn()
const updateReview = jest.fn()
jest.mock('@/generated-api-client/review', () => ({
  useCreateReview: () => ({ mutateAsync: createReview, isPending: false }),
  useUpdateReview: () => ({ mutateAsync: updateReview, isPending: false }),
}))

jest.mock('@/components/snackbar', () => ({
  useSnackbar: () => ({ showError: jest.fn(), showSuccess: jest.fn() }),
}))

describe('ReviewForm', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<ReviewForm quizId={1} onDone={jest.fn()} onCancel={jest.fn()} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('submits a new review with the selected rating and comment', async () => {
    createReview.mockResolvedValue({ data: {} })
    const onDone = jest.fn()

    const { getByTestId } = render(<ReviewForm quizId={1} onDone={onDone} onCancel={jest.fn()} />)

    fireEvent.click(getByTestId('rating-star-4'))
    fireEvent.change(getByTestId('review-comment-textarea'), {
      target: { value: 'Great quiz!' },
    })

    fireEvent.click(getByTestId('submit-review-button'))

    await waitFor(() => {
      expect(createReview).toHaveBeenCalledWith({ quizId: 1, data: { rating: 4, comment: 'Great quiz!' } })
      expect(onDone).toHaveBeenCalled()
    })
  })
})
