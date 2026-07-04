export function toTitleCase(str: string): string {
  // credits: https://stackoverflow.com/a/196991/8148505
  return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
}
