'use client'

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react'
import { Snackbar } from '@mui/joy'

type SnackbarColor = 'danger' | 'success' | 'neutral'

interface SnackbarState {
  message: string
  color: SnackbarColor
}

interface SnackbarContextValue {
  showError: (message: string) => void
  showSuccess: (message: string) => void
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null)

/**
 * This provider simplifies triggering the snackbar in any component
 * just use the "useSnackbar" hook to trigger it
 */
export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SnackbarState | null>(null)

  const show = useCallback((message: string, color: SnackbarColor) => {
    setState({ message, color })
  }, [])

  const value = useMemo<SnackbarContextValue>(
    () => ({
      showError: (message) => show(message, 'danger'),
      showSuccess: (message) => show(message, 'success'),
    }),
    [show],
  )

  return (
    <SnackbarContext.Provider value={value}>
      {children}

      <Snackbar
        open={!!state}
        onClose={() => setState(null)}
        autoHideDuration={4000}
        color={state?.color}
        variant="soft"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {state?.message}
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export function useSnackbar(): SnackbarContextValue {
  const contextValue = useContext(SnackbarContext)

  if (!contextValue) {
    throw new Error('useSnackbar hook can only be used within SnackbarProvider')
  }

  return contextValue
}
