/**
 * below "jest-environment" tag changes environment to "node" (so we can test SSR case)
 *
 * see
 *  - https://stackoverflow.com/questions/54038514/how-can-i-set-window-to-undefined-in-order-to-test-the-ssr-rendering-in-an-isomo
 *  - https://jestjs.io/docs/configuration#testenvironment-node--jsdom--string
 *
 * @jest-environment node
 */

import { customFetch } from './orval-custom-fetch'

const cookies = jest.fn()
jest.mock('next/headers', () => ({ cookies }))

jest.mock('@/constants/api-url', () => ({
  API_BASE_URL_ADAPTED: 'http://mock-backend',
}))

describe('customFetch (SSR)', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = fetchMock
  })

  // in SSR cookies are read from the request
  it('attaches the auth token read from the request cookies', async () => {
    cookies.mockResolvedValue({ get: () => ({ value: 'the-token' }) })

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

  /**
   * During SSR (i.e. in Server Components) we can't remove cookies
   * see https://nextjs.org/docs/app/api-reference/functions/cookies#understanding-cookie-behavior-in-server-components
   *
   * instead we just return the error response as it is (without logging out the user... it will be done in browser instead)
   */
  it('returns the error response as-is on a 401 response', async () => {
    cookies.mockResolvedValue({ get: () => undefined })
    fetchMock.mockResolvedValue({
      status: 401,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ message: 'Unauthorized' }),
    })

    const result = await customFetch('/quizzes/1')

    expect(result).toEqual({ status: 401, data: { message: 'Unauthorized' }, headers: expect.any(Headers) })
  })
})
