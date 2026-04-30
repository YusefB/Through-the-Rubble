import { describe, expect, it } from 'vitest'
import {
  GRAPHIC_PUBLISH_ALLOWED,
  RECONSTRUCTION_LABEL_REQUIRED,
  checkStoryReadyToPublish,
  publisherRank,
} from './policy'

describe('publisherRank', () => {
  it('returns 1 for ReliefWeb (UN tier)', () => {
    expect(publisherRank('ReliefWeb')).toBe(1)
  })

  it('returns 1 for other UN-tier publishers', () => {
    expect(publisherRank('UN OCHA')).toBe(1)
    expect(publisherRank('UNRWA')).toBe(1)
    expect(publisherRank('WHO')).toBe(1)
  })

  it('returns 2 for Human Rights Watch', () => {
    expect(publisherRank('Human Rights Watch')).toBe(2)
  })

  it('returns 2 for Amnesty International', () => {
    expect(publisherRank('Amnesty International')).toBe(2)
  })

  it('returns 3 for established wires', () => {
    expect(publisherRank('Associated Press')).toBe(3)
    expect(publisherRank('Reuters')).toBe(3)
    expect(publisherRank('Al Jazeera')).toBe(3)
  })

  it('returns 4 for unknown publishers', () => {
    expect(publisherRank('Some Random Blog')).toBe(4)
    expect(publisherRank('')).toBe(4)
    expect(publisherRank('reliefweb')).toBe(4) // case sensitive on purpose
  })
})

describe('GRAPHIC_PUBLISH_ALLOWED', () => {
  it('allows none and mild', () => {
    expect(GRAPHIC_PUBLISH_ALLOWED.none).toBe(true)
    expect(GRAPHIC_PUBLISH_ALLOWED.mild).toBe(true)
  })

  it('blocks moderate and blocked from auto-publish', () => {
    expect(GRAPHIC_PUBLISH_ALLOWED.moderate).toBe(false)
    expect(GRAPHIC_PUBLISH_ALLOWED.blocked).toBe(false)
  })
})

describe('RECONSTRUCTION_LABEL_REQUIRED', () => {
  it('returns true when the asset is AI-generated', () => {
    expect(RECONSTRUCTION_LABEL_REQUIRED(true)).toBe(true)
  })

  it('returns false when the asset is a real photo', () => {
    expect(RECONSTRUCTION_LABEL_REQUIRED(false)).toBe(false)
  })
})

describe('checkStoryReadyToPublish', () => {
  it('is ok when graphic=none, has source, editorial approved', () => {
    const result = checkStoryReadyToPublish({
      graphicLevel: 'none',
      hasAtLeastOneSource: true,
      editorialApproved: true,
    })
    expect(result.ok).toBe(true)
    expect(result.reasons).toEqual([])
  })

  it('is ok for mild content with source and approval', () => {
    const result = checkStoryReadyToPublish({
      graphicLevel: 'mild',
      hasAtLeastOneSource: true,
      editorialApproved: true,
    })
    expect(result.ok).toBe(true)
  })

  it('blocks moderate content even if approved with source', () => {
    const result = checkStoryReadyToPublish({
      graphicLevel: 'moderate',
      hasAtLeastOneSource: true,
      editorialApproved: true,
    })
    expect(result.ok).toBe(false)
    expect(result.reasons).toContain(
      'graphic_level "moderate" cannot be auto-published',
    )
  })

  it('blocks blocked content under all conditions', () => {
    const result = checkStoryReadyToPublish({
      graphicLevel: 'blocked',
      hasAtLeastOneSource: true,
      editorialApproved: true,
    })
    expect(result.ok).toBe(false)
    expect(result.reasons).toContain(
      'graphic_level "blocked" cannot be auto-published',
    )
  })

  it('lists every failure reason when none of the conditions are met', () => {
    const result = checkStoryReadyToPublish({
      graphicLevel: 'blocked',
      hasAtLeastOneSource: false,
      editorialApproved: false,
    })
    expect(result.ok).toBe(false)
    expect(result.reasons).toHaveLength(3)
    expect(result.reasons).toContain(
      'graphic_level "blocked" cannot be auto-published',
    )
    expect(result.reasons).toContain('no source attached')
    expect(result.reasons).toContain('not editorially approved')
  })

  it('flags missing source on its own', () => {
    const result = checkStoryReadyToPublish({
      graphicLevel: 'none',
      hasAtLeastOneSource: false,
      editorialApproved: true,
    })
    expect(result.ok).toBe(false)
    expect(result.reasons).toEqual(['no source attached'])
  })

  it('flags missing editorial approval on its own', () => {
    const result = checkStoryReadyToPublish({
      graphicLevel: 'none',
      hasAtLeastOneSource: true,
      editorialApproved: false,
    })
    expect(result.ok).toBe(false)
    expect(result.reasons).toEqual(['not editorially approved'])
  })
})
