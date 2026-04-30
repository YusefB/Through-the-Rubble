import type {
  Scene,
  SceneImage,
  ParallaxLayer,
  Chapter,
  Hotspot,
} from '@/lib/scene/types'

export const mockScene: Scene = {
  id: 'scene-main-street',
  slug: 'main-street',
  title: 'Main Street',
  defaultBeforeAfter: 'after',
}

export const mockImages: SceneImage[] = [
  {
    variant: 'before',
    url: '/scenes/main-street-before.webp',
    width: 1440,
    height: 3840,
    blurDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=',
    isReconstruction: true,
    reconstructionLabel:
      'Reconstruction based on archival imagery. Architectural details extrapolated from public records and witness accounts.',
    altText: 'Main Street as it appeared in 2019, with apartment buildings and a school visible.',
    creditLine: '© 2026 Through the Rubble — visual reconstruction',
  },
  {
    variant: 'after',
    url: '/scenes/main-street-after.webp',
    width: 1440,
    height: 3840,
    blurDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=',
    isReconstruction: false,
    altText: 'Main Street today, showing extensive damage to apartment buildings and the school.',
    creditLine: '© 2026 Through the Rubble',
  },
]

export const mockParallax: ParallaxLayer[] = [
  { id: 'haze',  url: '/scenes/parallax-haze.webp',  width: 1440, height: 3840, parallaxFactor: 0.4, opacity: 0.5, blendMode: 'screen' },
  { id: 'dust',  url: '/scenes/parallax-dust.webp',  width: 1440, height: 3840, parallaxFactor: 0.7, opacity: 0.6, blendMode: 'screen' },
  { id: 'smoke', url: '/scenes/parallax-smoke.webp', width: 1440, height: 3840, parallaxFactor: 0.85, opacity: 0.45, blendMode: 'screen' },
]

export const mockChapters: Chapter[] = [
  { id: 'ch-north-block', sceneId: 'scene-main-street', order: 0, label: 'North block', scrollAnchorY: 0.12 },
  { id: 'ch-school',      sceneId: 'scene-main-street', order: 1, label: 'School ruins', scrollAnchorY: 0.34 },
  { id: 'ch-shelter',     sceneId: 'scene-main-street', order: 2, label: 'Shelter site', scrollAnchorY: 0.56 },
  { id: 'ch-aid',         sceneId: 'scene-main-street', order: 3, label: 'Aid distribution', scrollAnchorY: 0.78 },
]

export const mockHotspots: Hotspot[] = [
  { id: 'h-apt-block',     sceneId: 'scene-main-street', chapterId: 'ch-north-block', label: 'Collapsed apartment block', geometry: { x: 0.42, y: 0.18, r: 0.035 }, type: 'story',   priority: 'hero',      visualState: 'always' },
  { id: 'h-school-ruins',  sceneId: 'scene-main-street', chapterId: 'ch-school',      label: 'School building ruins',     geometry: { x: 0.62, y: 0.36, r: 0.035 }, type: 'story',   priority: 'primary',   visualState: 'always' },
  { id: 'h-school-before', sceneId: 'scene-main-street', chapterId: 'ch-school',      label: 'School playground (2019)',  geometry: { x: 0.30, y: 0.34, r: 0.025 }, type: 'story',   priority: 'secondary', visualState: 'before-only' },
  { id: 'h-shelter',       sceneId: 'scene-main-street', chapterId: 'ch-shelter',     label: 'Displaced families shelter', geometry: { x: 0.50, y: 0.58, r: 0.030 }, type: 'stat',    priority: 'primary',   visualState: 'after-only' },
  { id: 'h-aid-tent',      sceneId: 'scene-main-street', chapterId: 'ch-aid',         label: 'Aid distribution tent',     geometry: { x: 0.72, y: 0.80, r: 0.030 }, type: 'action',  priority: 'primary',   visualState: 'after-only' },
]
