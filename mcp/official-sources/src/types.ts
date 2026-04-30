import { createHash } from 'node:crypto'

export type AcquisitionMode = 'api' | 'rss' | 'manual' | 'licensed'

export type NormalizedSource = {
  id: string
  publisher: string
  title: string
  url: string
  url_hash: string
  published_at: string | null
  fetched_at: string
  acquisition_mode: AcquisitionMode
  raw_payload: unknown
}

/**
 * Hash a URL into a stable hex SHA-256 digest.
 * Used as the unique key for source_registry rows.
 */
export function hashUrl(url: string): string {
  return createHash('sha256').update(url).digest('hex')
}
