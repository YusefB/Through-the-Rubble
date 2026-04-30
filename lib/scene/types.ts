export type Scene = {
  id: string
  slug: string
  title: string
  defaultBeforeAfter: 'before' | 'after'
}

export type SceneImage = {
  variant: 'before' | 'after'
  url: string
  width: number
  height: number
  blurDataUrl?: string
  isReconstruction: boolean
  reconstructionLabel?: string
  altText: string
  creditLine?: string
}

export type ParallaxLayer = {
  id: string
  url: string
  width: number
  height: number
  parallaxFactor: number
  opacity?: number
  blendMode?: 'normal' | 'screen' | 'multiply' | 'overlay'
}

export type Chapter = {
  id: string
  sceneId: string
  order: number
  label: string
  scrollAnchorY: number
  narration?: string
  sourceAnchorId?: string
}

export type HotspotGeometry = {
  x: number
  y: number
  r: number
}

export type HotspotDrawerSource = {
  publisher: string
  title: string
  url: string
}

export type HotspotDrawerAction = {
  category: 'donate' | 'learn' | 'advocate' | 'support' | 'read_more'
  label: string
  url?: string
}

export type HotspotDrawerContent = {
  title: string
  summary: string
  body: string
  sources: HotspotDrawerSource[]
  action?: HotspotDrawerAction
}

export type Hotspot = {
  id: string
  sceneId: string
  chapterId?: string
  label: string
  geometry: HotspotGeometry
  type: 'story' | 'stat' | 'timeline' | 'update' | 'action'
  priority: 'hero' | 'primary' | 'secondary' | 'optional'
  visualState: 'always' | 'after-only' | 'before-only'
  drawer?: HotspotDrawerContent
}

export type SceneEngineProps = {
  scene: Scene
  images: SceneImage[]
  parallaxLayers: ParallaxLayer[]
  chapters: Chapter[]
  hotspots: Hotspot[]
  initialBeforeAfter?: 'before' | 'after'
  onHotspotOpen?: (hotspotId: string) => void
  onChapterChange?: (chapterId: string) => void
  onToggleBeforeAfter?: (state: 'before' | 'after') => void
}
