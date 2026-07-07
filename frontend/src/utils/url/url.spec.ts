import { appendQueryParam, getParentDomain, isInternalRelativeUrl } from './url'

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

describe('getParentDomain', () => {
  it('returns the parent domain for an api subdomain', () => {
    expect(getParentDomain('https://quiziset-api.amjed.dev')).toBe('amjed.dev')
  })

  it("returns the same domain when it doesn't have a subdomain", () => {
    expect(getParentDomain('https://amjed.dev')).toBe('amjed.dev')
  })

  it('returns the host as it is for a single-name host (e.g. localhost)', () => {
    expect(getParentDomain('http://localhost:4004')).toBe('localhost')
  })

  it('returns undefined for an invalid url', () => {
    expect(getParentDomain('')).toBeUndefined()
  })
})
