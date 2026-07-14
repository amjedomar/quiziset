import { appendQueryParam, isInternalRelativeUrl } from '@/utils/url'
import { ValueOf } from '@/utils/typescript-utils'

export const REDIRECT_PARAM = 'redirect'

export const LOGIN_REASON_PARAM = 'reason'

export const LoginReason = {
  AccessProtectedPage: 'access-protected-page',
  SessionTimeout: 'session-timeout',
  Favorite: 'favorite',
} as const

export type LoginReason = ValueOf<typeof LoginReason>

export function isSafeRedirect(url: string | null | undefined): boolean {
  return isInternalRelativeUrl(url)
}

export function isLoginReason(value: string | null | undefined): value is LoginReason {
  return !!value && Object.values(LoginReason).includes(value as LoginReason)
}

export function appendRedirectParam(
  url: string,
  redirectTo: string | null | undefined,
  reason: LoginReason = LoginReason.AccessProtectedPage,
) {
  if (!redirectTo) {
    return url
  }

  const urlWithRedirect = appendQueryParam(url, REDIRECT_PARAM, redirectTo)

  return appendQueryParam(urlWithRedirect, LOGIN_REASON_PARAM, reason)
}
