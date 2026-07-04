import { createRef } from 'react'
import { mergeRefs } from './merge-refs'

describe('mergeRefs', () => {
  it('sets object refs and calls callback refs with the same element', () => {
    const objectRef = createRef<HTMLDivElement>()
    const callbackRef = jest.fn()
    const element = document.createElement('div')

    mergeRefs(objectRef, callbackRef)(element)

    expect(objectRef.current).toBe(element)
    expect(callbackRef).toHaveBeenCalledWith(element)
  })

  it('ignores null/undefined refs', () => {
    const element = document.createElement('div')

    expect(() => mergeRefs(null, undefined)(element)).not.toThrow()
  })
})
