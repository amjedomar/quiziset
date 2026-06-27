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
}

export function NavLinkButton({ href, label, icon, variant, fullWidth, onNavigate, size }: NavLinkButtonProps) {
  return (
    <Button
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
