import { Button, ButtonProps } from '@mui/joy'
import Link from 'next/link'
import { ReactNode } from 'react'

export interface NavLinkButtonProps {
  href: string
  label: string
  icon: ReactNode
  variant: 'plain' | 'soft'
  size?: ButtonProps['size']
  fullWidth?: boolean
  onNavigate?: () => void
  /**
   * this component is used both in the desktop nav and in the mobile drawer nav (at the same time)
   * so pass a different prefix per usage to avoid duplicated data-testid values
   */
  testIdPrefix?: string
}

export function NavLinkButton({
  href,
  label,
  icon,
  variant,
  fullWidth,
  onNavigate,
  size,
  testIdPrefix,
}: NavLinkButtonProps) {
  return (
    <Button
      data-testid={`${testIdPrefix ? `${testIdPrefix}-` : ''}nav-link${href}`}
      component={Link}
      color="neutral"
      variant={variant}
      href={href}
      startDecorator={icon}
      fullWidth={fullWidth}
      onClick={onNavigate}
      size={size}
      sx={{ justifyContent: 'start' }}
    >
      {label}
    </Button>
  )
}
