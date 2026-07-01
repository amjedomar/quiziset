import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithFormContext } from '@/test-utils/render-with-form-context'
import { FormImage } from './form-image'

jest.mock('@/generated-api-client/uploads', () => ({
  useUpload: () => ({ mutateAsync: jest.fn(), isPending: false }),
  useDeleteFile: () => ({ mutateAsync: jest.fn() }),
}))

describe('FormImage', () => {
  it('renders correctly', () => {
    const { asFragment } = renderWithFormContext(<FormImage name="image" bucketName="quizzes" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('shows the current image and clears the form value when deleted', async () => {
    const { container, getByTestId, formMethods } = renderWithFormContext(
      <FormImage name="image" bucketName="quizzes" />,
      {
        image: '/uploads/photo.png',
      },
    )

    expect(container.querySelector('img')).toHaveAttribute('src', expect.stringContaining('/uploads/photo.png'))

    await waitFor(() => {
      fireEvent.click(getByTestId('image-delete-button'))
    })

    expect(formMethods.getValues('image')).toBe('')
  })
})
