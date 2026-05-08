'use client'
import { ReactNode } from 'react'
import ThemeRegistry from '@/components/theme-registry/theme-registry'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return <ThemeRegistry options={{ key: 'joy' }}>{children}</ThemeRegistry>
}
