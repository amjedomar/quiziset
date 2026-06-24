'use client'

import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import { useState } from 'react'
import styles from './stars-rating.module.scss'
import clsx from 'clsx'

const STARS_ARRAY = [...Array.from({ length: 5 })].map((_, index) => index + 1)

interface StarsRatingProps {
  size: 'lg' | 'md' | 'sm'
  value: number
  readOnly?: boolean
  onChange?: (value: number) => void // called only when it isn't readOnly
}

export function StarsRating({ value, onChange, readOnly = false, size }: StarsRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  // while hovering show the hovered value (otherwise the actual value)
  const displayValue = hoverValue ?? value

  return (
    <span className={styles.container} onMouseLeave={() => setHoverValue(null)}>
      {STARS_ARRAY.map((starValue) => {
        const isFilled = starValue <= Math.round(displayValue)
        const Icon = isFilled ? StarRoundedIcon : StarBorderRoundedIcon
        const iconClassName = clsx(isFilled ? styles.starFilled : styles.star, styles[`star--${size}`])

        if (readOnly) {
          return <Icon key={starValue} className={iconClassName} />
        }

        return (
          <button
            key={starValue}
            className={styles.starButton}
            onMouseEnter={() => setHoverValue(starValue)}
            onClick={() => onChange?.(starValue)}
          >
            <Icon className={iconClassName} />
          </button>
        )
      })}
    </span>
  )
}
