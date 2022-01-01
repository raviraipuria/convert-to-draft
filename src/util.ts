export function shouldConvertToDraft(
  timestamp: string,
  num_days: number
): boolean {
  const daysInMillis = 1000 * 60 * 60 * 24 * num_days
  const millisSinceLastUpdated =
    new Date().getTime() - new Date(timestamp).getTime()
  return millisSinceLastUpdated > daysInMillis
}
