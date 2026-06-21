import { environmentManager, QueryClient } from '@tanstack/react-query'

/**
 * use this for SSR pages directly (because when it is used
 * in ServerComponent it is guaranteed that a new QueryClient
 * will be created for each request)
 *
 * However, for "app-provider.tsx" (we must use "getAppQueryClient" instead)
 *
 * btw currently `new QueryClient()` doesn't have any custom options
 * (but in future if needed we can define custom options here
 * and they will apply across the application)
 */
export function makeQueryClient() {
  return new QueryClient()
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
