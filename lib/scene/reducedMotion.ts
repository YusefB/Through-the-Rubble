const QUERY = '(prefers-reduced-motion: reduce)'

export function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia(QUERY).matches
}

export function subscribeToReducedMotion(
  callback: (reduced: boolean) => void,
): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }
  const mql = window.matchMedia(QUERY)
  const handler = (e: MediaQueryListEvent) => callback(e.matches)
  mql.addEventListener('change', handler)
  return () => mql.removeEventListener('change', handler)
}
