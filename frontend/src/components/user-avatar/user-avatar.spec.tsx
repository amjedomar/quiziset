import { render } from '@testing-library/react'
import { UserAvatar } from './user-avatar'

describe('UserAvatar', () => {
  it('correctly renders', () => {
    const { asFragment } = render(<UserAvatar name="Amjed Omar" imageUrl="/uploads/avatar.png" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders initials when there is no image', () => {
    const { getByText } = render(<UserAvatar name="Amjed Omar" />)

    expect(getByText('AO')).toBeInTheDocument()
  })
})
