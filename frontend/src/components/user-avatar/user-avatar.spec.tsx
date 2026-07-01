import { render } from '@testing-library/react'
import { UserAvatar } from './user-avatar'

jest.mock('@/constants/api-url', () => ({
  NEXT_PUBLIC_API_BASE_URL: 'http://mock-backend',
}))

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
