/**
 * Checks if passed url is *internal* relative url
 *   - if yes it will return true
 *   - if no (i.e. if it is absolute url OR protocol-relative e.g. `//example.com`)
 *     then it will return false
 */
export function isInternalRelativeUrl(url: string | null | undefined): boolean {
  return !!url?.startsWith('/') && !url.startsWith('//')
}

/**
 * Appends query param to the given url
 *
 * This works with any `url` whether it was relative or absolute :)
 *
 * I preferred to code it this way instead of using URL constructor
 * because "URL constructor" doesn't accept relative urls nor urls without protocols
 */
export function appendQueryParam(url: string, paramKey: string, paramValue: string): string {
  // hash part "#" if exists on the passed "url" it needs to stay as the last part
  // see https://stackoverflow.com/a/55339184/8148505
  const hashIndex = url.indexOf('#')

  const urlBeforeHash = hashIndex === -1 ? url : url.slice(0, hashIndex)
  const hashSegment = hashIndex === -1 ? '' : url.slice(hashIndex)

  const encodedValue = encodeURIComponent(paramValue)

  let separator = '?'

  if (urlBeforeHash.includes('?')) {
    /**
     * when this if-block is executed this means url already contains the query "?" symbol
     *
     * we just need to check if "?" or "&" is the last character in the `urlBeforeHash`
     *  - if yes --> then no need to add extra separator
     *  - if no --> then set the separator as "%"
     */
    separator = urlBeforeHash.endsWith('?') || urlBeforeHash.endsWith('&') ? '' : '&'
  }

  return `${urlBeforeHash}${separator}${paramKey}=${encodedValue}${hashSegment}`
}

/**
 * returns the "parent" domain of a url's hostname
 *
 * e.g.
 *  - quiziset-api.amjed.dev -> amjed.dev
 *  - amjed.dev -> amjed.dev
 *  - localhost -> localhost
 */
export function getParentDomain(url: string): string | undefined {
  try {
    const { hostname } = new URL(url)

    return hostname.split('.').slice(-2).join('.')
  } catch {
    return undefined
  }
}

export function matchesRoute(path: string, routes: string[]): boolean {
  // we only care about the pathname (so omit query string / hash segment)
  const pathname = typeof path === 'string' ? path.split('?')[0].split('#')[0] : ''

  if (!pathname) {
    return false
  }

  const pathSegments = pathname.split('/').filter((segment) => segment.length > 0)

  return routes.some((route) => {
    const routeSegments = route.split('/').filter((segment) => segment.length > 0)

    /**
     * if there are more `routeSegments` than `pathSegments` then return false
     * otherwise (in case `routeSegments` <= `pathSegments`) we need to check for a match
     *
     * we use `>` (not `!==`) to allow for prefix matching
     *
     * e.g.
     * the pathname "/managed-quizzes/create" should match the route
     * "/managed-quizzes" because the pathname starts with the route
     */
    if (routeSegments.length > pathSegments.length) {
      return false
    }

    return routeSegments.every((routeSegment, index) => {
      // ":param" matches any single path segment
      if (routeSegment.startsWith(':')) {
        return true
      }

      return routeSegment === pathSegments[index]
    })
  })
}
