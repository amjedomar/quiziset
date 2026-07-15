import { fireEvent, render } from '@testing-library/react'
import { ConfirmDeleteModal } from './confirm-delete-modal'

describe('ConfirmDeleteModal', () => {
  it('correctly renders', () => {
    const { baseElement } = render(
      <ConfirmDeleteModal open message="Are you sure?" onConfirm={jest.fn()} onCancel={jest.fn()} />,
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('calls onConfirm/onCancel when the respective button is clicked', () => {
    const onConfirm = jest.fn()
    const onCancel = jest.fn()

    const { getByTestId } = render(
      <ConfirmDeleteModal open message="Are you sure?" onConfirm={onConfirm} onCancel={onCancel} />,
    )

    fireEvent.click(getByTestId('confirm-delete-button'))
    fireEvent.click(getByTestId('cancel-delete-button'))

    expect(onConfirm).toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalled()
  })
})
