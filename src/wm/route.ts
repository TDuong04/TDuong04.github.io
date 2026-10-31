/** `#/projects/vital-agent` -> `projects/vital-agent`. Never throws; garbage -> null. */
export function parseHash(hash: string): string | null {
  const raw = hash.replace(/^#\/?/, '')
  if (!raw) return null
  try {
    return decodeURIComponent(raw)
  } catch {
    return null
  }
}

export function toHash(id: string | null): string {
  return id ? `#/${id}` : '#/'
}
