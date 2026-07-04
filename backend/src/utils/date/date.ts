const DAY_MS = 24 * 60 * 60 * 1000
const MIN_MS = 60 * 1000

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS)
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MIN_MS)
}
