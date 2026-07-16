'use client'

import { createContext, useCallback, useContext, useMemo, useState, ReactNode, MouseEventHandler } from 'react'
import { Snackbar } from '@mui/joy'
import styles from './snackbar-provider.module.scss'

type SnackbarOptions = { autoHideDuration: number }

type SnackbarColor = 'danger' | 'success' | 'neutral'

interface SnackbarState {
  // a unique id per trigger (used as the Snackbar `key`) to force mui to restart its auto-hide
  // timer on every call (even when the message text is identical to the previous one)
  id: number
  message: ReactNode
  color: SnackbarColor
  autoHideDuration: number
  open: boolean
}

interface SnackbarContextValue {
  showError: (message: ReactNode, options?: SnackbarOptions) => void
  showSuccess: (message: ReactNode, options?: SnackbarOptions) => void
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null)

/**
 * This provider simplifies triggering the snackbar in any component
 * just use the "useSnackbar" hook to trigger it
 */
export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SnackbarState | null>(null)

  const show = useCallback((message: ReactNode, color: SnackbarColor, options?: SnackbarOptions) => {
    setState((prev) => ({
      id: (prev?.id ?? 0) + 1,
      message,
      color,
      autoHideDuration: options?.autoHideDuration ?? 4000,
      open: true,
    }))
  }, [])

  const close = useCallback(() => {
    setState((prev) => (prev ? { ...prev, open: false } : null))
  }, [])

  const value = useMemo<SnackbarContextValue>(
    () => ({
      showError: (message, options) => show(message, 'danger', options),
      showSuccess: (message, options) => show(message, 'success', options),
    }),
    [show],
  )

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target

    if (target instanceof HTMLElement) {
      const isLinkClicked = target.tagName.toLowerCase() === 'a' || target.closest('a')

      if (isLinkClicked) {
        close() // close snackbar
      }
    }
  }

  return (
    <SnackbarContext.Provider value={value}>
      {children}

      <Snackbar
        key={state?.id}
        className={styles.message}
        open={state?.open ?? false}
        onClose={close}
        autoHideDuration={state?.autoHideDuration}
        color={state?.color}
        variant="solid"
        invertedColors
        onClick={handleClick}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
