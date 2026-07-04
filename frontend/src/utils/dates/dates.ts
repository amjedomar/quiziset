export function formatDate(value: string | Date): string {
  const date = new Date(value)
  const year = date.getFullYear().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatTime(value: string | Date): string {
  const date = new Date(value)

  const hrs = date.getHours().toString().padStart(2, '0')
  const mins = date.getMinutes().toString().padStart(2, '0')

  return `${hrs}:${mins}`
}

export function formatDateTime(value: string | Date): string {
  return `${formatDate(value)} ${formatTime(value)}`
}

export function formatTimeDuration(start: string | Date, finish: string | Date): string {
  const totalSeconds = Math.max(0, Math.round((new Date(finish).getTime() - new Date(start).getTime()) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts: string[] = []
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  parts.push(`${seconds}s`)

  return parts.join(' ')
}
