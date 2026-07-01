import { render } from '@testing-library/react'
import SearchIcon from '@mui/icons-material/Search'
import { NavLinkButton } from './nav-link-button'

describe('NavLinkButton', () => {
  it('correctly renders', () => {
    const { asFragment } = render(
      <NavLinkButton href="/favorites" label="Favorites" icon={<SearchIcon />} variant="plain" />,
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders a link with the given href and label', () => {
    const { getByTestId } = render(
      <NavLinkButton href="/favorites" label="Favorites" icon={<SearchIcon />} variant="plain" />,
    )

    expect(getByTestId('nav-link/favorites')).toHaveAttribute('href', '/favorites')
  })
})
