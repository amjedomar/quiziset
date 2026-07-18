'use client'

import { Button, ButtonProps } from '@mui/joy'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()

  const isActive = pathname === href

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
      sx={{
        justifyContent: 'start',
        // see https://v7.mui.com/joy-ui/customization/theme-colors/
        ...(isActive && { bgcolor: `neutral.${variant}HoverBg` }),
      }}
    >
      {label}
    </Button>
  )
}
