import { act, fireEvent, render } from '@testing-library/react'
import { UserEntity } from '@/generated-api-client/model'
import { ProfileAvatarEditor } from './profile-avatar-editor'

const uploadFile = jest.fn()
jest.mock('@/generated-api-client/uploads', () => ({
  useUpload: () => ({ mutateAsync: uploadFile, isPending: false }),
}))

const updateMe = jest.fn()
jest.mock('@/generated-api-client/user', () => ({
  useUpdateMe: () => ({ mutateAsync: updateMe, isPending: false }),
}))

const showSuccess = jest.fn()
jest.mock('@/components/snackbar', () => ({
  useSnackbar: () => ({ showError: jest.fn(), showSuccess }),
}))

const user: UserEntity = {
  id: 1,
  name: 'Amjed Omar',
  email: 'amjed@example.com',
  imageUrl: '/uploads/avatar.png',
}

describe('ProfileAvatarEditor', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('correctly renders', () => {
    const { asFragment } = render(<ProfileAvatarEditor user={user} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('removes the image when the remove button is clicked', async () => {
    const { getByTestId } = render(<ProfileAvatarEditor user={user} />)

    updateMe.mockResolvedValue({ data: { id: 1, name: 'Amjed Omar', email: 'amjed@example.com', imageUrl: null } })

    await act(async () => {
      fireEvent.click(getByTestId('remove-image-button'))
    })

    expect(updateMe).toHaveBeenCalledWith({ data: { imageUrl: null } })
    expect(showSuccess).toHaveBeenCalledWith('Profile image removed')
  })

  it('uploads the selected file and saves it as the new image', async () => {
    const { container } = render(<ProfileAvatarEditor user={user} />)

    uploadFile.mockResolvedValue({ data: { url: '/uploads/profiles/new-avatar.png' } })
    updateMe.mockResolvedValue({
      data: { id: 1, name: 'Amjed Omar', email: 'amjed@example.com', imageUrl: '/uploads/profiles/new-avatar.png' },
    })

    const file = new File(['content'], 'new-avatar.png', { type: 'image/png' })
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } })
    })

    expect(uploadFile).toHaveBeenCalledWith({ bucketName: 'profiles', data: { file } })
    expect(updateMe).toHaveBeenCalledWith({ data: { imageUrl: '/uploads/profiles/new-avatar.png' } })
    expect(showSuccess).toHaveBeenCalledWith('Profile image updated')
  })
})
