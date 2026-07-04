import { getInitials } from './get-initials'

describe('getInitials', () => {
  it('returns the first letter of the first and last names', () => {
    expect(getInitials('Amjed Omar')).toBe('AO')
  })

  it('returns a single letter for a single-word name', () => {
    expect(getInitials('Amjed')).toBe('A')
  })
})
