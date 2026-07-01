import { fireEvent, render } from '@testing-library/react'
import { ReviewEntity } from '@/generated-api-client/model'
import { ReviewItem } from './review-item'

const review: ReviewEntity = {
  id: 1,
  rating: 4,
  comment: 'Great quiz!',
  author: { id: 1, name: 'Amjed Omar', imageUrl: null },
  isMine: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('ReviewItem', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<ReviewItem review={review} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it("calls onEdit/onDelete when the action buttons are clicked (btw these only shown when it is user's own review)", () => {
    const onEdit = jest.fn()
    const onDelete = jest.fn()
    const { getByTestId } = render(<ReviewItem review={review} onEdit={onEdit} onDelete={onDelete} />)

    fireEvent.click(getByTestId('edit-review-button'))
    fireEvent.click(getByTestId('delete-review-button'))

    expect(onEdit).toHaveBeenCalled()
    expect(onDelete).toHaveBeenCalled()
  })
})
