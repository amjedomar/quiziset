import { environmentManager } from '@tanstack/react-query'
import { getAppQueryClient, makeQueryClient } from './query-client'

describe('makeQueryClient', () => {
  it('creates a QueryClient with networkMode set to always', () => {
    const queryClient = makeQueryClient()

    expect(queryClient.getDefaultOptions().queries?.networkMode).toBe('always')
    expect(queryClient.getDefaultOptions().mutations?.networkMode).toBe('always')
  })
})

describe('getAppQueryClient', () => {
  afterEach(() => {
    environmentManager.setIsServer(() => false)
  })

  it('creates a new QueryClient on every call on the server', () => {
    environmentManager.setIsServer(() => true)

    expect(getAppQueryClient()).not.toBe(getAppQueryClient())
  })

  it('reuses the same QueryClient across calls in the browser', () => {
    environmentManager.setIsServer(() => false)

    expect(getAppQueryClient()).toBe(getAppQueryClient())
  })
})
