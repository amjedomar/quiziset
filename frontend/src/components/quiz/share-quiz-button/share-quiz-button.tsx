'use client'

import { Button, ButtonProps, IconButton } from '@mui/joy'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import clsx from 'clsx'
import { DisabledTooltip } from '@/ui/disabled-tooltip'
import { useSnackbar } from '@/components/snackbar'
import styles from './share-quiz-button.module.scss'

type LabelDisplay = 'always' | 'responsive' | 'never'

interface ShareQuizButtonProps {
  quizId: number
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
  color?: ButtonProps['color']
  labelDisplay?: LabelDisplay
  disabled?: boolean
}

export function getQuizShareUrl(quizId: number): string {
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return `${origin}/quizzes/${quizId}/overview`
}

export function ShareQuizButton({
  quizId,
  size,
  variant = 'outlined',
  color = 'neutral',
  labelDisplay = 'always',
  disabled = false,
}: ShareQuizButtonProps) {
  const { showSuccess } = useSnackbar()

  const testId = `share-quiz-${quizId}-button`

  // mui joy drops the disabled attribute during SSR
  // but as a workaround I pass it via slotProps.root which fixes the issue :)
  const disabledProp = disabled ? { slotProps: { root: { disabled: true } } } : {}

  const button =
    labelDisplay === 'never' ? (
      <IconButton
        data-testid={testId}
        size={size}
        variant={variant}
        color={color}
        aria-label="Share quiz"
        {...disabledProp}
      >
        <ShareOutlinedIcon />
      </IconButton>
    ) : (
      <Button
        data-testid={testId}
        size={size}
        variant={variant}
        color={color}
        startDecorator={<ShareOutlinedIcon />}
        className={clsx({ [styles.responsive]: labelDisplay === 'responsive' })}
        {...disabledProp}
      >
        <span className={clsx({ [styles.responsive]: labelDisplay === 'responsive' })}>Share</span>
      </Button>
    )

  // a private quiz can't be shared (so disable the button and show tooltip)
  if (disabled) {
    return (
      <DisabledTooltip disabled title="Quiz is private (can't be shared)">
        {button}
      </DisabledTooltip>
    )
  }

  return (
    <CopyToClipboard text={getQuizShareUrl(quizId)} onCopy={() => showSuccess('Quiz link copied to clipboard!')}>
      {button}
    </CopyToClipboard>
  )
}
