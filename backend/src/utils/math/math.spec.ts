import { round1 } from './math'

describe('round1', () => {
  it('rounds to one decimal place', () => {
    expect(round1(3.14123)).toBe(3.1)
  })

  it('rounds up when the second decimal is 5 or more', () => {
    expect(round1(3.15)).toBe(3.2)
  })
})
