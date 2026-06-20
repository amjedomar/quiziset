'use client'

import { Chip } from '@mui/joy'
import TimerIcon from '@mui/icons-material/Timer'
import { useEffect, useEffectEvent, useRef, useState } from 'react'

const LOW_TIME_THRESHOLD_MS = 30 * 1000

function getRemainingMs(expireTime: string): number {
  return new Date(expireTime).getTime() - Date.now()
}

/**
 * formats remaining milliseconds as "MM:SS"
 * (while making sure they never go below "00:00")
 */
function formatRemaining(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

interface QuizSessionTimerProps {
  expireTime: string // date string of when the session expires (in standard format)
  onExpire: () => void // called when the time is up
}

export function QuizSessionTimer({ expireTime, onExpire: onExpireProp }: QuizSessionTimerProps) {
  // pass initial state as function (so it is called during component initialization ONLY)
  // see https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
  const [remainingMs, setRemainingMs] = useState(() => getRemainingMs(expireTime))

  // make sure "onExpire" fires only once (just to be extra careful)
  const hasExpiredRef = useRef(false)

  // useEffectEvent always calls the latest "onExpireProp" and it is non-reactive
  // which is GREAT! that means no need to list it as dep in useEffect below :)
  // see how React docs implemented an interval using it
  // https://react.dev/reference/react/useEffectEvent#using-effect-events-in-custom-hooks
  const onExpire = useEffectEvent(onExpireProp)

  useEffect(() => {
    const tick = () => {
      const remaining = getRemainingMs(expireTime)

      setRemainingMs(remaining)

      if (remaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true
        onExpire()
      }
    }

    tick()

    const intervalId = setInterval(tick, 1000)

    return () => clearInterval(intervalId)
  }, [expireTime])

  const isLowOnTime = remainingMs <= LOW_TIME_THRESHOLD_MS

  return (
    <Chip size="lg" variant="soft" color={isLowOnTime ? 'danger' : 'neutral'} startDecorator={<TimerIcon />}>
      {formatRemaining(remainingMs)}
    </Chip>
  )
}
