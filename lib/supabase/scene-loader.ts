import { createSupabaseServerClient } from './server'
import {
  rowToScene,
  rowToChapter,
  rowToHotspot,
  rowToSceneImage,
  rowToParallax,
  buildDrawerContent,
} from './scene-queries'
import type {
  Scene,
  SceneImage,
  ParallaxLayer,
  Chapter,
  Hotspot,
} from '@/lib/scene/types'
import type { Database } from './database.types'

type SourceRegistryRow = Database['public']['Tables']['source_registry']['Row']

export type LoadedScene = {
  scene: Scene
  images: SceneImage[]
  parallaxLayers: ParallaxLayer[]
  chapters: Chapter[]
  hotspots: Hotspot[]
}

/**
 * Load a published scene by slug from Supabase. Returns null if the scene
 * doesn't exist, isn't published, or if Supabase is unreachable. Callers
 * should fall back to mock fixtures in that case.
 */
export async function loadSceneBySlug(slug: string): Promise<LoadedScene | null> {
  let supabase
  try {
    supabase = await createSupabaseServerClient()
  } catch {
    return null
  }

  const { data: sceneRow, error: sceneErr } = await supabase
    .from('scenes')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (sceneErr || !sceneRow) return null

  const scene = rowToScene(sceneRow)

  const [chaptersRes, hotspotsRes, imagesRes, storiesRes, storySourcesRes, sourcesRes] =
    await Promise.all([
      supabase
        .from('chapters')
        .select('*')
        .eq('scene_id', sceneRow.id)
        .order('order', { ascending: true }),
      supabase
        .from('hotspots')
        .select('*')
        .eq('scene_id', sceneRow.id),
      supabase
        .from('image_metadata')
        .select('*')
        .eq('scene_id', sceneRow.id),
      supabase
        .from('stories')
        .select('*'),
      supabase
        .from('story_sources')
        .select('*'),
      supabase
        .from('source_registry')
        .select('*'),
    ])

  if (chaptersRes.error || hotspotsRes.error || imagesRes.error) return null

  const chapters: Chapter[] = (chaptersRes.data ?? []).map(rowToChapter)

  const masterImages: SceneImage[] = []
  const parallaxLayers: ParallaxLayer[] = []
  for (const row of imagesRes.data ?? []) {
    if (row.variant === 'before' || row.variant === 'after') {
      masterImages.push(rowToSceneImage(row))
    } else if (row.variant === 'parallax') {
      parallaxLayers.push(rowToParallax(row))
    }
  }

  const storiesById = new Map((storiesRes.data ?? []).map((s) => [s.id, s]))
  const sourcesById = new Map<string, SourceRegistryRow>(
    (sourcesRes.data ?? []).map((s) => [s.id, s]),
  )
  const sourcesByStoryId = new Map<string, SourceRegistryRow[]>()
  for (const link of storySourcesRes.data ?? []) {
    const source = sourcesById.get(link.source_id)
    if (!source) continue
    const list = sourcesByStoryId.get(link.story_id) ?? []
    list.push(source)
    sourcesByStoryId.set(link.story_id, list)
  }

  const hotspots: Hotspot[] = (hotspotsRes.data ?? []).map((row) => {
    const story = row.story_id ? storiesById.get(row.story_id) : undefined
    const sources = row.story_id ? sourcesByStoryId.get(row.story_id) ?? [] : []
    const drawer = story ? buildDrawerContent(story, sources, row) : undefined
    return rowToHotspot(row, drawer)
  })

  return {
    scene,
    images: masterImages,
    parallaxLayers,
    chapters,
    hotspots,
  }
}
