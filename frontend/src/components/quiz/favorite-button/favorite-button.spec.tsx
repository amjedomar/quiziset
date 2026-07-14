import { fireEvent, render, waitFor } from '@testing-library/react'
import { FavoriteButton } from './favorite-button'

const push = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

const addFavorite = jest.fn()
const removeFavorite = jest.fn()
jest.mock('@/generated-api-client/quiz', () => ({
  useAddFavorite: () => ({ mutateAsync: addFavorite, isPending: false }),
  useRemoveFavorite: () => ({ mutateAsync: removeFavorite, isPending: false }),
}))

jest.mock('@/components/snackbar', () => ({
  useSnackbar: () => ({ showError: jest.fn() }),
}))

jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ isLoggedIn: true, isCheckingLogin: false }),
}))

describe('FavoriteButton', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<FavoriteButton quizId={1} isFavorite={false} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('adds the quiz to favorites (if not added yet) when clicked', async () => {
    addFavorite.mockResolvedValue({ data: {} })

    const { getByTestId } = render(<FavoriteButton quizId={1} isFavorite={false} />)

    fireEvent.click(getByTestId('favorite-button'))

    await waitFor(() => {
      expect(addFavorite).toHaveBeenCalledWith({ quizId: 1 })
    })
  })

  it('removes the quiz from favorites (if already added) when clicked', async () => {
    removeFavorite.mockResolvedValue({ data: {} })

    const { getByTestId } = render(<FavoriteButton quizId={1} isFavorite={true} />)

    fireEvent.click(getByTestId('favorite-button'))

    await waitFor(() => {
      expect(removeFavorite).toHaveBeenCalledWith({ quizId: 1 })
    })
  })
})
