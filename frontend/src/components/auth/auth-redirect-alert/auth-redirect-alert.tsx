import { Alert } from '@mui/joy'
import { LoginReason } from '@/utils/redirect'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

type AuthAction = 'login' | 'signup'

const REASON_ALERTS: Record<LoginReason, { color: 'primary' | 'warning'; login: string; signup: string }> = {
  [LoginReason.AccessProtectedPage]: {
    color: 'primary',
    login: 'Please login then you will be redirected back to the last page you were trying to access',
    signup: 'Please sign up then you will be redirected back to the last page you were trying to access',
  },
  [LoginReason.SessionTimeout]: {
    color: 'warning',
    login: 'Session Timeout (please login again then you will be redirected back to the last page you were on)',
    signup: 'Session Timeout (please sign up or login then you will be redirect back to the last page you were on)',
  },
  [LoginReason.Favorite]: {
    color: 'primary',
    login: 'Please login so you can favorite quizzes (then you will be redirected back to the last page you were on)',
    signup:
      'Please sign up so you can favorite quizzes (then you will be redirected back to the last page you were on)',
  },
}

interface AuthRedirectAlertProps {
  action: AuthAction
  reason: LoginReason
}

export function AuthRedirectAlert({ action, reason }: AuthRedirectAlertProps) {
  const alertRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const alert = REASON_ALERTS[reason]

  const searchParams = useSearchParams()

  const bounce = () => {
    const box = alertRef.current

    if (!box) return

    // Stop the current bounce
    animationRef.current?.cancel()

    /**
     * Transform animation logic was inspired from this answer:
     * https://stackoverflow.com/a/54282004/8148505
     *
     * but I used JS `.animate()` function instead + applied different values for the `scale`
     */
    animationRef.current = box.animate(
      [
        { transform: 'scale(1)', offset: 0 },
        { transform: 'scale(1.04)', offset: 0.25 },
        { transform: 'scale(0.98)', offset: 0.5 },
        { transform: 'scale(1.02)', offset: 0.75 },
        { transform: 'scale(1)', offset: 1 },
      ],
      {
        duration: 450,
        easing: 'linear',
      },
    )
  }

  useEffect(() => {
    // when redirectTo param changes it will be re-bounced (see `searchParams` dep)
    bounce()
  }, [searchParams])

  return (
    <Alert ref={alertRef} color={alert.color} variant="soft">
      {alert[action]}
    </Alert>
  )
}
