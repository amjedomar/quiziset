import { render } from '@testing-library/react'
import ProfilePage from './page'

const ProfileForm = jest.fn<React.JSX.Element, [unknown]>(() => <div data-testid="profile-form" />)
jest.mock('@/components/profile/profile-form', () => ({
  ProfileForm: (props: unknown) => ProfileForm(props),
}))

describe('ProfilePage', () => {
  it('renders the profile form', () => {
    const { getByTestId } = render(<ProfilePage />)

    expect(getByTestId('profile-form')).toBeInTheDocument()
  })
})
