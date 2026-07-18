import { render } from '@testing-library/react'
import NextLink from 'next/link'
import { matchesRoute } from '@/utils/url'
import { AppLink } from './app-link'

jest.mock('next/link', () => ({
  __esModule: true,
  default: jest.fn(({ href }: { href: string }) => <a href={href} />),
}))

jest.mock('@/utils/url', () => ({
  matchesRoute: jest.fn(),
}))

const mockedNextLink = jest.mocked(NextLink)
const mockedMatchesRoute = jest.mocked(matchesRoute)

describe('AppLink', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets prefetch to false (when the route can be redirected by proxy.ts)', () => {
    mockedMatchesRoute.mockReturnValue(true)

    render(<AppLink href="/protected-route" prefetch />)

    const receivedProps = mockedNextLink.mock.calls[0][0]

    expect(receivedProps).toEqual(
      expect.objectContaining({
        href: '/protected-route',
        prefetch: false,
      }),
    )
  })

  it('leaves prefetch undefined (when the route is never redirected by proxy.ts)', () => {
    mockedMatchesRoute.mockReturnValue(false)

    render(<AppLink href="/public-route" />)

    const receivedProps = mockedNextLink.mock.calls[0][0]

    expect(receivedProps).toEqual(
      expect.objectContaining({
        href: '/public-route',
      }),
    )

    expect(receivedProps.prefetch).toBeUndefined()
  })
})
