import { appendQueryParam, isInternalRelativeUrl } from '@/utils/url'

export const REDIRECT_PARAM = 'redirect'

export function isSafeRedirect(url: string | null | undefined): boolean {
  return isInternalRelativeUrl(url)
}

export function appendRedirectParam(url: string, redirectTo: string | null | undefined) {
  if (!redirectTo) {
    return url
  }

  return appendQueryParam(url, REDIRECT_PARAM, redirectTo)
}
