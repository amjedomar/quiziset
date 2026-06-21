'use client'
import { ReactNode } from 'react'
import ThemeRegistry from '@/components/theme-registry/theme-registry'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/hooks/use-auth'
import { getAppQueryClient } from '@/utils/query-client'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const queryClient = getAppQueryClient()

  return (
    <ThemeRegistry options={{ key: 'joy', prepend: true }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ThemeRegistry>
  )
}
