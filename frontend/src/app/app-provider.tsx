'use client'
import { ReactNode } from 'react'
import ThemeRegistry from '@/components/theme-registry/theme-registry'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface AppProviderProps {
  children: ReactNode
}

const queryClient = new QueryClient()

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeRegistry options={{ key: 'joy', prepend: true }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeRegistry>
  )
}
