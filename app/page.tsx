import { Suspense } from 'react'
import { SceneViewport } from '@/components/scene/SceneViewport'
import { HotspotDrawer } from '@/components/scene/HotspotDrawer'
import { StoryModePlayer } from '@/components/scene/StoryModePlayer'
import { ActionLayer } from '@/components/action/ActionLayer'
import { LanguageToggle } from '@/components/i18n/LanguageToggle'
import { loadSceneBySlug } from '@/lib/supabase/scene-loader'
import {
  mockScene,
  mockImages,
  mockParallax,
  mockChapters,
  mockHotspots,
} from '@/lib/scene/fixtures/mockScene'

export const revalidate = 60 // ISR: re-fetch published content every 60s

export default async function HomePage() {
  // Try Supabase first; fall back to mock fixtures if the DB is unreachable
  // or empty. This keeps the demo working in any environment without manual
  // setup, while the real content lives in Supabase once seeded.
  const live = await loadSceneBySlug('main-street')

  const scene = live?.scene ?? mockScene
  const images = live?.images.length ? live.images : mockImages
  const parallaxLayers = live?.parallaxLayers.length
    ? live.parallaxLayers
    : mockParallax
  const chapters = live?.chapters.length ? live.chapters : mockChapters
  const hotspots = live?.hotspots.length ? live.hotspots : mockHotspots

  return (
    <main style={{ background: '#0a0a0a', color: '#f5ebd8', minHeight: '100vh' }}>
      <div
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          zIndex: 50,
        }}
      >
        <LanguageToggle />
      </div>
      <Suspense fallback={null}>
        <SceneViewport
          scene={scene}
          images={images}
          parallaxLayers={parallaxLayers}
          chapters={chapters}
          hotspots={hotspots}
        >
          <HotspotDrawer hotspots={hotspots} />
          <StoryModePlayer chapters={chapters} />
        </SceneViewport>
      </Suspense>
      <ActionLayer />
    </main>
  )
}
