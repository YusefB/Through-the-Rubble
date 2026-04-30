import type {
  Scene,
  SceneImage,
  ParallaxLayer,
  Chapter,
  Hotspot,
  HotspotDrawerContent,
} from '@/lib/scene/types'
import type { Database } from './database.types'

type ScenesRow = Database['public']['Tables']['scenes']['Row']
type ChaptersRow = Database['public']['Tables']['chapters']['Row']
type HotspotsRow = Database['public']['Tables']['hotspots']['Row']
type StoriesRow = Database['public']['Tables']['stories']['Row']
type SourceRegistryRow = Database['public']['Tables']['source_registry']['Row']
type ImageMetadataRow = Database['public']['Tables']['image_metadata']['Row']

export function rowToScene(r: ScenesRow): Scene {
  if (r.default_before_after !== 'before' && r.default_before_after !== 'after') {
    throw new Error(`Invalid default_before_after: ${r.default_before_after}`)
  }
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    defaultBeforeAfter: r.default_before_after,
  }
}

export function rowToChapter(r: ChaptersRow): Chapter {
  return {
    id: r.id,
    sceneId: r.scene_id,
    order: r.order,
    label: r.label,
    scrollAnchorY: r.scroll_anchor_y,
    ...(r.narration ? { narration: r.narration } : {}),
    ...(r.source_anchor_id ? { sourceAnchorId: r.source_anchor_id } : {}),
  }
}

export function rowToHotspot(
  r: HotspotsRow,
  drawer?: HotspotDrawerContent,
): Hotspot {
  const type = r.type as Hotspot['type']
  const priority = r.priority as Hotspot['priority']
  const visualState = r.visual_state as Hotspot['visualState']

  const result: Hotspot = {
    id: r.id,
    sceneId: r.scene_id,
    label: r.label,
    geometry: { x: r.geometry_x, y: r.geometry_y, r: r.geometry_r },
    type,
    priority,
    visualState,
  }
  if (r.chapter_id) result.chapterId = r.chapter_id
  if (drawer) result.drawer = drawer
  return result
}

export function rowToParallax(r: ImageMetadataRow): ParallaxLayer {
  if (r.variant !== 'parallax') {
    throw new Error(`rowToParallax called on non-parallax variant: ${r.variant}`)
  }
  const result: ParallaxLayer = {
    id: r.id,
    url: r.asset_path,
    width: r.width,
    height: r.height,
    parallaxFactor: r.parallax_factor ?? 1,
  }
  if (r.parallax_opacity != null) result.opacity = r.parallax_opacity
  if (r.parallax_blend_mode) {
    result.blendMode = r.parallax_blend_mode as NonNullable<ParallaxLayer['blendMode']>
  }
  return result
}

export function rowToSceneImage(r: ImageMetadataRow): SceneImage {
  if (r.variant !== 'before' && r.variant !== 'after') {
    throw new Error(
      `rowToSceneImage called on non-master variant: ${r.variant}`,
    )
  }
  const result: SceneImage = {
    variant: r.variant,
    url: r.asset_path,
    width: r.width,
    height: r.height,
    isReconstruction: r.is_generated,
    altText: r.alt_text,
  }
  if (r.blur_data_url) result.blurDataUrl = r.blur_data_url
  if (r.reconstruction_label) result.reconstructionLabel = r.reconstruction_label
  if (r.credit_line) result.creditLine = r.credit_line
  return result
}

export function buildDrawerContent(
  story: StoriesRow,
  sources: SourceRegistryRow[],
  hotspot: HotspotsRow,
): HotspotDrawerContent {
  const drawer: HotspotDrawerContent = {
    title: story.title,
    summary: story.short_summary,
    body: story.body,
    sources: sources.map((s) => ({
      publisher: s.publisher,
      title: s.title,
      url: s.url,
    })),
  }
  if (hotspot.action_category && hotspot.action_label) {
    drawer.action = {
      category: hotspot.action_category as NonNullable<HotspotDrawerContent['action']>['category'],
      label: hotspot.action_label,
      ...(hotspot.action_url ? { url: hotspot.action_url } : {}),
    }
  }
  return drawer
}
