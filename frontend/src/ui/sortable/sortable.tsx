import { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/react/sortable'

export type HandleRef = (element: Element | null) => void

interface SortableProps {
  id: string
  index: number
  className?: string
  renderHandle?: (handleRef: HandleRef) => ReactNode
  children: ReactNode
}

export function Sortable({ id, index, className, renderHandle, children }: SortableProps) {
  const { ref, handleRef, isDragging } = useSortable({ id, index })

  return (
    <div ref={ref} className={className} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {renderHandle?.(handleRef)}
      {children}
    </div>
  )
}
