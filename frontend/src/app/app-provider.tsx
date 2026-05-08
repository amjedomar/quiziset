'use client'
import { ReactNode } from 'react'
import { theme } from '@/theme'
import { CssBaseline, CssVarsProvider } from '@mui/joy'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  )
}
