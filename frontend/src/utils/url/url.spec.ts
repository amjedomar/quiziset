import { appendQueryParam, isInternalRelativeUrl } from './url'

describe('isInternalRelativeUrl', () => {
  it('returns true for an internal relative url', () => {
    expect(isInternalRelativeUrl('/profile')).toBe(true)
  })

  it('returns false for a protocol-relative url', () => {
    expect(isInternalRelativeUrl('//another-domain.com')).toBe(false)
  })

  it('returns false for an absolute url', () => {
    expect(isInternalRelativeUrl('https://another-domain.com')).toBe(false)
  })
})

describe('appendQueryParam', () => {
  it('appends the param to a url with no existing query string', () => {
    expect(appendQueryParam('/login', 'redirect', '/profile')).toBe('/login?redirect=%2Fprofile')
  })

  it('appends the param to a url that already has a query string', () => {
    expect(appendQueryParam('/login?foo=bar', 'redirect', '/profile')).toBe('/login?foo=bar&redirect=%2Fprofile')
  })

  it('keeps the hash fragment as the last part', () => {
    expect(appendQueryParam('/login#section', 'redirect', '/profile')).toBe('/login?redirect=%2Fprofile#section')
  })
})
