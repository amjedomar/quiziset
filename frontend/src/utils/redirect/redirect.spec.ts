import { appendRedirectParam, isSafeRedirect } from './redirect'

describe('isSafeRedirect', () => {
  it('returns true for an internal relative url', () => {
    expect(isSafeRedirect('/profile')).toBe(true)
  })

  it('returns false for an absolute url', () => {
    expect(isSafeRedirect('https://another-domain.com')).toBe(false)
  })
})

describe('appendRedirectParam', () => {
  it('appends the redirect param when redirectTo is given', () => {
    expect(appendRedirectParam('/login', '/profile')).toBe('/login?redirect=%2Fprofile')
  })

  it('returns the url unchanged when redirectTo is not given', () => {
    expect(appendRedirectParam('/login', undefined)).toBe('/login')
  })
})
