export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) {
    return ''
  }

  const first = words.at(0)?.at(0)
  const last = words.at(-1)?.at(0)

  return [first, last]
    .filter((value) => typeof value === 'string')
    .join('')
    .toUpperCase()
}
