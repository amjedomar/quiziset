import { render } from '@testing-library/react'
import FavoritesPage from './page'

const FavoriteQuizzesList = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="favorite-quizzes-list" />)
jest.mock('@/components/quiz/favorite-quizzes-list', () => ({
  FavoriteQuizzesList: (props: unknown) => FavoriteQuizzesList(props),
}))

describe('FavoritesPage', () => {
  it('renders the favorite quizzes list', () => {
    const { getByTestId } = render(<FavoritesPage />)

    expect(getByTestId('favorite-quizzes-list')).toBeInTheDocument()
  })
})
