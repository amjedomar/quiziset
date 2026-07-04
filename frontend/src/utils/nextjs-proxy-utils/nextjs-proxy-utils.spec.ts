import { checkIfUserLikelyLoggedIn, matchesRoute } from './nextjs-proxy-utils'

const decodeJwt = jest.fn()
jest.mock('jose', () => ({
  decodeJwt: (token: string) => decodeJwt(token),
}))

const dateNowInSecs = Math.floor(Date.now() / 1000)
const ONE_HOUR = 3600

describe('checkIfUserLikelyLoggedIn', () => {
  it('returns true for a non-expired token', () => {
    decodeJwt.mockReturnValue({ exp: dateNowInSecs + ONE_HOUR })

    expect(checkIfUserLikelyLoggedIn('the-token')).toBe(true)
  })

  it('returns false for an expired token', () => {
    decodeJwt.mockReturnValue({ exp: dateNowInSecs - 10 })

    expect(checkIfUserLikelyLoggedIn('the-token')).toBe(false)
  })

  it('returns false when there is no token', () => {
    expect(checkIfUserLikelyLoggedIn(undefined)).toBe(false)
  })
})

describe('matchesRoute', () => {
  it('matches an exact route', () => {
    expect(matchesRoute('/profile', ['/profile'])).toBe(true)
  })

  it('matches a route with a dynamic param', () => {
    expect(matchesRoute('/quizzes/5/overview', ['/quizzes/:quizId/overview'])).toBe(true)
  })

  it('matches routes by prefix', () => {
    expect(matchesRoute('/manage-quizzes/create', ['/manage-quizzes'])).toBe(true)
  })

  it('returns false when no route matches', () => {
    expect(matchesRoute('/login', ['/profile'])).toBe(false)
  })
})
