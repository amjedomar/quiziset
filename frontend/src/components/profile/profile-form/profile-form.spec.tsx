import { fireEvent, render, waitFor } from '@testing-library/react'
import { ProfileForm } from './profile-form'

const currentUser = { id: 1, name: 'Amjed Omar', email: 'amjed@example.com', imageUrl: null }
jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ isCheckingLogin: false, isLoadingCurrentUser: false, currentUser }),
}))

const updateMe = jest.fn()
jest.mock('@/generated-api-client/user', () => ({
  useUpdateMe: () => ({ mutateAsync: updateMe, isPending: false }),
}))

jest.mock('@/generated-api-client/uploads', () => ({
  useUpload: () => ({ mutateAsync: jest.fn(), isPending: false }),
}))

const showSuccess = jest.fn()
jest.mock('@/components/snackbar', () => ({
  useSnackbar: () => ({ showError: jest.fn(), showSuccess }),
}))

describe('ProfileForm', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<ProfileForm />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('saves the updated profile details', async () => {
    updateMe.mockResolvedValue({ data: currentUser })

    const { getByLabelText, getByTestId } = render(<ProfileForm />)

    fireEvent.change(getByLabelText('Name'), { target: { value: 'New Name' } })
    fireEvent.change(getByLabelText('Email'), { target: { value: 'new-email@example.com' } })

    fireEvent.click(getByTestId('save-profile-button'))

    await waitFor(() => {
      expect(updateMe).toHaveBeenCalledWith({ data: { name: 'New Name', email: 'new-email@example.com' } })
      expect(showSuccess).toHaveBeenCalledWith('Profile updated')
    })
  })
})
