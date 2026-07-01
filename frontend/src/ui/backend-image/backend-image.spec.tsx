import { render } from '@testing-library/react'
import { BackendImage } from './backend-image'

jest.mock('@/constants/api-url', () => ({
  NEXT_PUBLIC_API_BASE_URL: 'http://mock-backend',
}))

describe('BackendImage', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<BackendImage src="/uploads/avatar.png" alt="avatar" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('prepends the backend base url to the given src', () => {
    const { getByAltText } = render(<BackendImage src="/uploads/avatar.png" alt="avatar" />)

    expect(getByAltText('avatar')).toHaveAttribute('src', 'http://mock-backend/uploads/avatar.png')
  })
})
