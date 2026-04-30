import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchReliefWebUpdates } from './reliefweb.js'
import { hashUrl } from '../types.js'

function mockFetchOnce(payload: unknown, init: { ok?: boolean; status?: number } = {}) {
  const ok = init.ok ?? true
  const status = init.status ?? 200
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok,
      status,
      statusText: ok ? 'OK' : 'ERR',
      json: async () => payload,
    })) as unknown as typeof fetch,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('fetchReliefWebUpdates', () => {
  it('returns an empty array when ReliefWeb returns no data', async () => {
    mockFetchOnce({ data: [] })

    const result = await fetchReliefWebUpdates({ country: 'Palestinian Territory, occupied' })

    expect(result).toEqual([])
  })

  it('maps a sample report to a NormalizedSource', async () => {
    const sampleReport = {
      id: 4242,
      fields: {
        title: 'Humanitarian Update — Gaza',
        url_alias: 'https://reliefweb.int/report/sample-update',
        date: { original: '2026-04-15T00:00:00+00:00', created: '2026-04-15T01:00:00+00:00' },
        source: [{ name: 'OCHA', shortname: 'ocha' }],
      },
    }
    mockFetchOnce({ data: [sampleReport] })

    const [normalized] = await fetchReliefWebUpdates({ limit: 5 })

    expect(normalized).toMatchObject({
      id: 'reliefweb:4242',
      publisher: 'OCHA',
      title: 'Humanitarian Update — Gaza',
      url: 'https://reliefweb.int/report/sample-update',
      url_hash: hashUrl('https://reliefweb.int/report/sample-update'),
      published_at: '2026-04-15T00:00:00+00:00',
      acquisition_mode: 'api',
    })
    expect(normalized.fetched_at).toMatch(/\d{4}-\d{2}-\d{2}T/)
    expect(normalized.raw_payload).toEqual(sampleReport)
  })

  it('handles missing optional fields gracefully', async () => {
    const minimalReport = { id: 7, fields: {} }
    mockFetchOnce({ data: [minimalReport] })

    const [normalized] = await fetchReliefWebUpdates()

    expect(normalized.id).toBe('reliefweb:7')
    expect(normalized.title).toBe('(untitled)')
    expect(normalized.publisher).toBe('ReliefWeb')
    expect(normalized.url).toBe('')
    expect(normalized.published_at).toBeNull()
    expect(normalized.acquisition_mode).toBe('api')
    expect(typeof normalized.url_hash).toBe('string')
    expect(normalized.url_hash).toHaveLength(64)
  })

  it('throws when the API responds with an error status', async () => {
    mockFetchOnce({}, { ok: false, status: 503 })

    await expect(fetchReliefWebUpdates()).rejects.toThrow(/ReliefWeb API request failed/)
  })
})
