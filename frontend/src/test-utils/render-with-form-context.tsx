import { ReactNode } from 'react'
import { render, RenderResult } from '@testing-library/react'
import { FieldValues, FormProvider, useForm, UseFormReturn } from 'react-hook-form'

interface RenderWithFormResult extends RenderResult {
  formMethods: UseFormReturn
}

/**
 * renders a component that relies on react-hook-form's context (useFormContext)
 * and returns the "formMethods" (so tests use it to interact with the form and do the testing logic)
 */
export function renderWithFormContext(ui: ReactNode, defaultValues?: FieldValues): RenderWithFormResult {
  let formMethods!: UseFormReturn

  function Wrapper({ children }: { children: ReactNode }) {
    formMethods = useForm({ defaultValues })
    return <FormProvider {...formMethods}>{children}</FormProvider>
  }

  const renderResult = render(ui, { wrapper: Wrapper })

  return { ...renderResult, formMethods }
}
