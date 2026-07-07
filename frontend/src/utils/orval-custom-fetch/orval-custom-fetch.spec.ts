import { USER_TOKEN_COOKIE } from '@/constants/auth'
import { customFetch } from './orval-custom-fetch'

const jsCookieGet = jest.fn()
const jsCookieRemove = jest.fn()
jest.mock('js-cookie', () => ({
  get: (...args: unknown[]) => jsCookieGet(...args),
  remove: (...args: unknown[]) => jsCookieRemove(...args),
}))

jest.mock('@/constants/api-url', () => ({
  API_BASE_URL_ADAPTED: 'http://mock-backend',
}))

describe('customFetch (browser)', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = fetchMock
  })

  // in browser cookies are read from document.cookie (via `js-cookie`)
  it('attaches the auth token read from the cookie', async () => {
    jsCookieGet.mockReturnValue('the-token')
    fetchMock.mockResolvedValue({
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ id: 1 }),
    })

    const result = await customFetch('/quizzes/1')

    expect(fetchMock).toHaveBeenCalledWith('http://mock-backend/quizzes/1', {
      headers: { Authorization: 'Bearer the-token' },
    })
    expect(result).toEqual({ status: 200, data: { id: 1 }, headers: expect.any(Headers) })
  })

  // in browser it removes token cookie (when 401 response is returned)
  it('removes the auth cookie on a 401 response', async () => {
    fetchMock.mockResolvedValue({
      status: 401,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ message: 'Unauthorized' }),
    })

    await customFetch('/quizzes/1')

    expect(jsCookieRemove).toHaveBeenCalledWith(USER_TOKEN_COOKIE, expect.objectContaining({ sameSite: 'lax' }))
  })
})
