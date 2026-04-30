import { Suspense } from 'react'
import { SceneViewport } from '@/components/scene/SceneViewport'
import { HotspotDrawer } from '@/components/scene/HotspotDrawer'
import { ActionLayer } from '@/components/action/ActionLayer'
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
      <Suspense fallback={null}>
        <SceneViewport
          scene={mockScene}
          images={mockImages}
          parallaxLayers={mockParallax}
          chapters={mockChapters}
          hotspots={mockHotspots}
        >
          <HotspotDrawer hotspots={mockHotspots} />
        </SceneViewport>
      </Suspense>
      <ActionLayer />
    </main>
  )
}
