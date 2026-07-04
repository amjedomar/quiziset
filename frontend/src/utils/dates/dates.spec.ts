import { formatDate, formatDateTime, formatTime, formatTimeDuration } from './dates'

describe('formatDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(formatDate('2026-07-03T10:30:00.000Z')).toBe('2026-07-03')
  })
})

describe('formatTime', () => {
  it('formats a date as HH:mm', () => {
    expect(formatTime('2026-07-03T10:30:00.000Z')).toBe('10:30')
  })
})

describe('formatDateTime', () => {
  it('formats a date as "YYYY-MM-DD HH:mm"', () => {
    expect(formatDateTime('2026-07-03T10:30:00.000Z')).toBe('2026-07-03 10:30')
  })
})

describe('formatTimeDuration', () => {
  it('formats the difference between two dates as "Xh Xm Xs"', () => {
    expect(formatTimeDuration('2026-07-03T10:00:00.000Z', '2026-07-03T11:02:07.000Z')).toBe('1h 2m 7s')
  })

  it('omits hours and minutes when they are zero', () => {
    expect(formatTimeDuration('2026-07-03T10:00:00.000Z', '2026-07-03T10:00:14.000Z')).toBe('14s')
  })
})
