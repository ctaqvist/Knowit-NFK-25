export function isCacheFresh(time: string, maxAgeMs: number): boolean {
  const lastUpdatedEpoch = new Date(time).getTime()
  const nowEpoch = Date.now();

  return (nowEpoch - lastUpdatedEpoch <= maxAgeMs)
}