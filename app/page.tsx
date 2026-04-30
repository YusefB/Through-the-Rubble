import { Suspense } from 'react'
import { SceneViewport } from '@/components/scene/SceneViewport'
import { HotspotDrawer } from '@/components/scene/HotspotDrawer'
import { StoryModePlayer } from '@/components/scene/StoryModePlayer'
import { ActionLayer } from '@/components/action/ActionLayer'
import { LanguageToggle } from '@/components/i18n/LanguageToggle'
import {
  mockScene,
  mockImages,
  mockParallax,
  mockChapters,
  mockHotspots,
} from '@/lib/scene/fixtures/mockScene'

export default function HomePage() {
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
          scene={mockScene}
          images={mockImages}
          parallaxLayers={mockParallax}
          chapters={mockChapters}
          hotspots={mockHotspots}
        >
          <HotspotDrawer hotspots={mockHotspots} />
          <StoryModePlayer chapters={mockChapters} />
        </SceneViewport>
      </Suspense>
      <ActionLayer />
    </main>
  )
}
