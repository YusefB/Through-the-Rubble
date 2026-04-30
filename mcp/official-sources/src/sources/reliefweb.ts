import { hashUrl, type NormalizedSource } from '../types.js'

export type ReliefWebQuery = {
  country?: string
  limit?: number
}

type ReliefWebReportFields = {
  title?: string
  url?: string
  url_alias?: string
  date?: {
    created?: string
    original?: string
  }
  source?: Array<{ name?: string; shortname?: string }>
}

type ReliefWebReport = {
  id?: string | number
  fields?: ReliefWebReportFields
}

type ReliefWebResponse = {
  data?: ReliefWebReport[]
}

const DEFAULT_COUNTRY = 'Palestinian Territory, occupied'
const DEFAULT_LIMIT = 10
const APP_NAME = 'through-the-rubble'

/**
 * Fetch ReliefWeb reports and map them to NormalizedSource[].
 *
 * Calls the public ReliefWeb v1 API. No auth required.
 * Returns an array shaped for the source_registry table — the caller
 * (admin import flow) is responsible for any persistence.
 */
export async function fetchReliefWebUpdates(
  query: ReliefWebQuery = {},
): Promise<NormalizedSource[]> {
  const country = query.country ?? DEFAULT_COUNTRY
  const limit = query.limit ?? DEFAULT_LIMIT

  const params = new URLSearchParams({
    appname: APP_NAME,
    'query[value]': country,
    limit: String(limit),
  })

  const endpoint = `https://api.reliefweb.int/v1/reports?${params.toString()}`

  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error(
      `ReliefWeb API request failed: ${response.status} ${response.statusText}`,
    )
  }

  const json = (await response.json()) as ReliefWebResponse
  const reports = json.data ?? []
  const fetchedAt = new Date().toISOString()

  return reports.map((report) => mapReport(report, fetchedAt))
}

function mapReport(report: ReliefWebReport, fetchedAt: string): NormalizedSource {
  const fields = report.fields ?? {}
  const url = fields.url_alias ?? fields.url ?? ''
  const title = fields.title ?? '(untitled)'
  const publisher = fields.source?.[0]?.name ?? fields.source?.[0]?.shortname ?? 'ReliefWeb'
  const publishedAt = fields.date?.original ?? fields.date?.created ?? null

  const url_hash = url ? hashUrl(url) : hashUrl(`reliefweb:${String(report.id ?? title)}`)
  const id = report.id != null ? `reliefweb:${String(report.id)}` : `reliefweb:${url_hash}`

  return {
    id,
    publisher,
    title,
    url,
    url_hash,
    published_at: publishedAt,
    fetched_at: fetchedAt,
    acquisition_mode: 'api',
    raw_payload: report,
  }
}
