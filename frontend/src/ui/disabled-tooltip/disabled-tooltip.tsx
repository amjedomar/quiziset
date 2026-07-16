'use client'

import { cloneElement, ReactElement } from 'react'
import { Tooltip } from '@mui/joy'
import styles from './disabled-tooltip.module.scss'

interface DisabledTooltipProps {
  disabled: boolean
  title: string
  children: ReactElement<{ disabled?: boolean }>
}

export function DisabledTooltip({ disabled, title, children }: DisabledTooltipProps) {
  if (!disabled) {
    return children
  }

  const disabledChild = cloneElement(children, {
    disabled,
  })

  return (
    // to make tooltip clickable on mobile we need to pass `enterTouchDelay={0}`
    // see https://stackoverflow.com/a/70270694/8148505
    <Tooltip title={title} enterTouchDelay={0}>
      <span className={styles.trigger}>{disabledChild}</span>
    </Tooltip>
  )
}
