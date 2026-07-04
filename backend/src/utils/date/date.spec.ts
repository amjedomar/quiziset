import { addDays, addMinutes } from './date'

describe('addDays', () => {
  it('returns a new date adjusted by the given number of days', () => {
    expect(addDays(new Date('2026-07-01T00:00:00.000Z'), 3)).toEqual(new Date('2026-07-04T00:00:00.000Z'))
  })
})

describe('addMinutes', () => {
  it('returns a new date adjusted by the given number of minutes', () => {
    expect(addMinutes(new Date('2026-07-01T00:00:00.000Z'), 90)).toEqual(new Date('2026-07-01T01:30:00.000Z'))
  })
})
