import { Ref, RefCallback } from 'react'

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
  return (element: T | null) => {
    refs.forEach((ref) => {
      if (!ref) {
        return
      }

      if (typeof ref === 'function') {
        ref(element)
        return
      }

      ref.current = element
    })
  }
}
