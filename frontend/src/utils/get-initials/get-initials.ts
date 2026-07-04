export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)

  const first = words.at(0)?.at(0)?.toUpperCase() ?? ''
  const last = words.at(-1)?.at(0)?.toUpperCase() ?? ''

  if (words.length === 1) {
    return first
  }

  return first + last
}
