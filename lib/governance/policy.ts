/**
 * Editorial governance policy expressed as code.
 *
 * The full prose policy lives in `docs/sourcing-policy.md`. The publishing
 * checklist lives in `docs/dignity-checklist.md`. This module is the
 * machine-readable subset that the admin pipeline calls to gate publishing.
 */

export const SOURCE_LADDER_RANK = {
  'UN OCHA': 1,
  UNRWA: 1,
  ReliefWeb: 1,
  WHO: 1,
  'Human Rights Watch': 2,
  'Amnesty International': 2,
  'Associated Press': 3,
  Reuters: 3,
  'Al Jazeera': 3,
  // unknown publishers default to rank 4
} as const

export type GraphicLevel = 'none' | 'mild' | 'moderate' | 'blocked'

export const GRAPHIC_PUBLISH_ALLOWED: Record<GraphicLevel, boolean> = {
  none: true,
  mild: true,
  moderate: false, // requires manual editorial unblock
  blocked: false,
}

export const RECONSTRUCTION_LABEL_REQUIRED = (isGenerated: boolean) => isGenerated

export type AcquisitionMode = 'api' | 'rss' | 'manual' | 'licensed'

export type SourceCheckResult = {
  ok: boolean
  reasons: string[]
}

export function checkStoryReadyToPublish(input: {
  graphicLevel: GraphicLevel
  hasAtLeastOneSource: boolean
  editorialApproved: boolean
}): SourceCheckResult {
  const reasons: string[] = []
  if (!GRAPHIC_PUBLISH_ALLOWED[input.graphicLevel]) {
    reasons.push(`graphic_level "${input.graphicLevel}" cannot be auto-published`)
  }
  if (!input.hasAtLeastOneSource) {
    reasons.push('no source attached')
  }
  if (!input.editorialApproved) {
    reasons.push('not editorially approved')
  }
  return { ok: reasons.length === 0, reasons }
}

export function publisherRank(publisher: string): number {
  return (SOURCE_LADDER_RANK as Record<string, number>)[publisher] ?? 4
}
