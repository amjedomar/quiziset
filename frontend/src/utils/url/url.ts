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
