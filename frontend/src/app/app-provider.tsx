'use client'
import { ReactNode } from 'react'
import ThemeRegistry from '@/components/theme-registry/theme-registry'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/hooks/use-auth'

interface AppProviderProps {
  children: ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0, // disable cache
    },
  },
})

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeRegistry options={{ key: 'joy', prepend: true }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ThemeRegistry>
  )
}
