import { toTitleCase } from './string'

describe('toTitleCase', () => {
  it('capitalizes the first letter of each word', () => {
    expect(toTitleCase('javascript basics')).toBe('Javascript Basics')
  })

  it('lowercases the rest of each word', () => {
    expect(toTitleCase('JAVASCRIPT BASICS')).toBe('Javascript Basics')
  })
})
