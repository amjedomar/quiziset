// rounds to one decimal
export function round1(value: number): number {
  // see https://stackoverflow.com/a/51357551/8148505
  return Math.round(value * 10) / 10
}
