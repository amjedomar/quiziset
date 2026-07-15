import { FormHelperText } from '@mui/joy'
import { ReactNode, useEffect, useRef } from 'react'
import { useFormContext, useFormState } from 'react-hook-form'

interface FormFieldHintProps {
  name: string
  children: ReactNode
}

export function FormFieldHint({ name, children }: FormFieldHintProps) {
  const { getFieldState } = useFormContext()
  const fieldFormState = useFormState({ name })
  const { error } = getFieldState(name, fieldFormState)
  const hasError = !!(error?.root?.message ?? error?.message)

  const hintRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)

  useEffect(() => {
    if (!hasError) return

    const hint = hintRef.current
    if (!hint) return

    animationRef.current?.cancel()
    animationRef.current = hint.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(4px)' },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 400, easing: 'ease-in-out' },
    )
    // "submitCount" is a dep so the shake animation replays on every failed submit
  }, [fieldFormState.submitCount, hasError])

  return (
    <FormHelperText
      ref={hintRef}
      sx={{ mt: 1, color: hasError ? 'danger.500' : 'text.tertiary', fontWeight: hasError ? 700 : 400 }}
    >
      {children}
    </FormHelperText>
  )
}
