import { describe, it, expect } from 'vitest'
import {
  rowToScene,
  rowToChapter,
  rowToHotspot,
  rowToSceneImage,
  rowToParallax,
  buildDrawerContent,
} from './scene-queries'
import type { Database } from './database.types'

type ScenesRow = Database['public']['Tables']['scenes']['Row']
type ChaptersRow = Database['public']['Tables']['chapters']['Row']
type HotspotsRow = Database['public']['Tables']['hotspots']['Row']
type StoriesRow = Database['public']['Tables']['stories']['Row']
type SourceRegistryRow = Database['public']['Tables']['source_registry']['Row']
type ImageMetadataRow = Database['public']['Tables']['image_metadata']['Row']

describe('scene-queries mappers', () => {
  it('rowToScene normalizes default_before_after literal', () => {
    const row: ScenesRow = {
      id: 's1',
      slug: 'main',
      title: 'Main Street',
      default_before_after: 'after',
      language: 'en',
      translation_group: null,
      is_published: true,
      created_at: '2026-04-30T00:00:00Z',
      updated_at: '2026-04-30T00:00:00Z',
    }
    expect(rowToScene(row)).toEqual({
      id: 's1',
      slug: 'main',
      title: 'Main Street',
      defaultBeforeAfter: 'after',
    })
  })

  it('rowToScene throws on invalid default_before_after', () => {
    const row = { default_before_after: 'invalid' } as unknown as ScenesRow
    expect(() => rowToScene(row)).toThrow()
  })

  it('rowToChapter omits optional fields when null', () => {
    const row: ChaptersRow = {
      id: 'c1',
      scene_id: 's1',
      order: 0,
      label: 'North',
      scroll_anchor_y: 0.25,
      narration: null,
      source_anchor_id: null,
      created_at: '2026-04-30T00:00:00Z',
    }
    const c = rowToChapter(row)
    expect(c.id).toBe('c1')
    expect(c.scrollAnchorY).toBe(0.25)
    expect('narration' in c).toBe(false)
    expect('sourceAnchorId' in c).toBe(false)
  })

  it('rowToChapter includes narration when present', () => {
    const row: ChaptersRow = {
      id: 'c1',
      scene_id: 's1',
      order: 0,
      label: 'North',
      scroll_anchor_y: 0.25,
      narration: 'A documentary line about the north block.',
      source_anchor_id: null,
      created_at: '2026-04-30T00:00:00Z',
    }
    const c = rowToChapter(row)
    expect(c.narration).toBe('A documentary line about the north block.')
  })

  it('rowToHotspot maps geometry to nested shape', () => {
    const row: HotspotsRow = {
      id: 'h1',
      scene_id: 's1',
      chapter_id: 'c1',
      story_id: null,
      label: 'Building',
      geometry_x: 0.42,
      geometry_y: 0.18,
      geometry_r: 0.035,
      type: 'story',
      priority: 'hero',
      visual_state: 'always',
      action_category: null,
      action_label: null,
      action_url: null,
      created_at: '2026-04-30T00:00:00Z',
    }
    const h = rowToHotspot(row)
    expect(h.geometry).toEqual({ x: 0.42, y: 0.18, r: 0.035 })
    expect(h.chapterId).toBe('c1')
    expect(h.priority).toBe('hero')
  })

  it('rowToHotspot attaches drawer content when passed', () => {
    const row: HotspotsRow = {
      id: 'h1',
      scene_id: 's1',
      chapter_id: null,
      story_id: 'st1',
      label: 'Building',
      geometry_x: 0.4,
      geometry_y: 0.2,
      geometry_r: 0.03,
      type: 'story',
      priority: 'primary',
      visual_state: 'always',
      action_category: null,
      action_label: null,
      action_url: null,
      created_at: '2026-04-30T00:00:00Z',
    }
    const h = rowToHotspot(row, {
      title: 'Title',
      summary: 'Sum',
      body: 'Body',
      sources: [],
    })
    expect(h.drawer?.title).toBe('Title')
  })

  it('rowToParallax requires variant=parallax', () => {
    const r = { variant: 'before' } as unknown as ImageMetadataRow
    expect(() => rowToParallax(r)).toThrow()
  })

  it('rowToParallax maps blend mode and opacity when present', () => {
    const r: ImageMetadataRow = {
      id: 'p1',
      scene_id: 's1',
      variant: 'parallax',
      asset_path: '/dust.webp',
      width: 1440,
      height: 3840,
      blur_data_url: null,
      is_generated: false,
      reconstruction_label: null,
      credit_line: null,
      license_type: null,
      source_url: null,
      alt_text: '',
      graphic_level: 'none',
      parallax_factor: 0.6,
      parallax_opacity: 0.7,
      parallax_blend_mode: 'screen',
      mobile_crop: null,
      desktop_crop: null,
      created_at: '2026-04-30T00:00:00Z',
    }
    const p = rowToParallax(r)
    expect(p.opacity).toBe(0.7)
    expect(p.blendMode).toBe('screen')
  })

  it('rowToSceneImage requires master variant', () => {
    const r = { variant: 'parallax' } as unknown as ImageMetadataRow
    expect(() => rowToSceneImage(r)).toThrow()
  })

  it('buildDrawerContent assembles story + sources + action', () => {
    const story: StoriesRow = {
      id: 'st1',
      title: 'Story title',
      short_summary: 'Sum',
      body: 'Body',
      tone: 'documentary',
      language: 'en',
      translation_group: null,
      graphic_level: 'none',
      is_published: true,
      created_at: '2026-04-30T00:00:00Z',
      updated_at: '2026-04-30T00:00:00Z',
    }
    const src: SourceRegistryRow = {
      id: 'sr1',
      publisher: 'UN OCHA',
      title: 'Report title',
      url: 'https://example.org/x',
      url_hash: 'h',
      published_at: null,
      fetched_at: null,
      acquisition_mode: 'manual',
      raw_payload: null,
      created_at: '2026-04-30T00:00:00Z',
    }
    const hot: HotspotsRow = {
      id: 'h1',
      scene_id: 's1',
      chapter_id: null,
      story_id: 'st1',
      label: 'X',
      geometry_x: 0,
      geometry_y: 0,
      geometry_r: 0,
      type: 'story',
      priority: 'primary',
      visual_state: 'always',
      action_category: 'learn',
      action_label: 'Read more',
      action_url: 'https://example.org/learn',
      created_at: '2026-04-30T00:00:00Z',
    }
    const drawer = buildDrawerContent(story, [src], hot)
    expect(drawer.title).toBe('Story title')
    expect(drawer.sources).toHaveLength(1)
    expect(drawer.sources[0]?.publisher).toBe('UN OCHA')
    expect(drawer.action?.category).toBe('learn')
    expect(drawer.action?.url).toBe('https://example.org/learn')
  })
})
