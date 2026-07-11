import { render } from '@testing-library/react'
import { BackendBackgroundImage } from './backend-background-image'

jest.mock('@/constants/api-url', () => ({
  NEXT_PUBLIC_API_BASE_URL: 'http://mock-backend',
}))

describe('BackendBackgroundImage', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<BackendBackgroundImage src="/public/images/quizzes/math.jpg" />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('sets a background image with the backend base url prepended to the given src', () => {
    const { container } = render(<BackendBackgroundImage src="/public/images/quizzes/math.jpg" />)

    expect((container.firstChild as HTMLElement).style.backgroundImage).toContain(
      'http://mock-backend/public/images/quizzes/math.jpg',
    )
  })
})
