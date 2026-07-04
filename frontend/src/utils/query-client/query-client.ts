import { environmentManager, QueryClient } from '@tanstack/react-query'

/**
 * use this for SSR pages directly (because when it is used
 * in ServerComponent it is guaranteed that a new QueryClient
 * will be created for each request)
 *
 * However, for "app-provider.tsx" (we must use "getAppQueryClient" instead)
 */
export function makeQueryClient() {
  // see https://github.com/TanStack/query/issues/2179#issuecomment-2043018904
  // set "networkMode" to "always" so it throws an error when user is offline
  return new QueryClient({
    defaultOptions: {
      queries: {
        networkMode: 'always',
      },
      mutations: {
        networkMode: 'always',
      },
    },
  })
}

let browserAppQueryClient: QueryClient | undefined

/**
 * Returns the react-query client following the official SSR guide instructions:
 * https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr#initial-setup
 *
 * btw this function should only be used in "app-provider.tsx"
 *   - because there we must it in Client Component 'use client'
 *     (since QueryClientProvider relies on useContext under the hood)
 *   - and of course we can't use a workaround like passing the queryClient from
 *     ServerComponent (i.e. our app/layout.tsx) to ClientComponent (i.e. our app-provider)
 *     since then another error will be thrown "Only plain objects, and a few built-ins
 *     can be passed to Client Components from Server Components"
 *
 * Thus, we must follow the official guide to create it :)
 */
export function getAppQueryClient() {
  if (environmentManager.isServer()) {
    /**
     * In server always make a new QueryClient for every request
     *
     * It is crucial that we AVOID sharing it between multiple requests
     * because this later case (as QueryClient docs mentioned):
     * "Besides being bad for performance, this also leaks any sensitive data"
     */
    return makeQueryClient()
  } else {
    /**
     * In browser make a new query client if we don't already have one
     * This is very important so we don't re-make a new client if React
     * suspends during the initial render
     *
     * btw this may not be needed if we have a suspense boundary
     * BELOW the creation of the query client
     *
     * but anyway it is better to do it this way to
     * ensure reliability in future (if anything changes
     * regarding the use of suspends)
     */
    if (!browserAppQueryClient) {
      browserAppQueryClient = makeQueryClient()
    }

    return browserAppQueryClient
  }
}
