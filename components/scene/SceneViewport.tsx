'use client'
import { useEffect, useRef } from 'react'
import type { SceneEngineProps } from '@/lib/scene/types'
import {
  SceneStoreProvider,
  useSceneStore,
  useSceneStoreApi,
} from '@/lib/scene/SceneStoreContext'
import { useChapterDetection } from '@/lib/scene/useChapterDetection'
import { useDeepLinkSync } from '@/lib/scene/useDeepLinkSync'
import { detectReducedMotion, subscribeToReducedMotion } from '@/lib/scene/reducedMotion'
import { MasterLayer, ParallaxLayer } from './SceneLayer'
import { HotspotOverlay } from './HotspotOverlay'
import { BeforeAfterToggle } from './BeforeAfterToggle'
import { ChapterAnchor } from './ChapterAnchor'
import { ReconstructionLabel } from './ReconstructionLabel'

export function SceneViewport(
  props: SceneEngineProps & { children?: React.ReactNode },
) {
  const { children, ...engineProps } = props
  const initialBeforeAfter =
    engineProps.initialBeforeAfter ?? engineProps.scene.defaultBeforeAfter
  return (
    <SceneStoreProvider
      initial={{
        activeChapterId: null,
        beforeAfter: initialBeforeAfter,
        openHotspotId: null,
        reducedMotion: false,
      }}
    >
      <SceneViewportInner {...engineProps} />
      {children}
    </SceneStoreProvider>
  )
}

function SceneViewportInner({
  scene,
  images,
  parallaxLayers,
  chapters,
  hotspots,
  onHotspotOpen,
  onChapterChange,
  onToggleBeforeAfter,
}: SceneEngineProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const storeApi = useSceneStoreApi()
  const beforeAfter = useSceneStore((s) => s.beforeAfter)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)

  useDeepLinkSync()
  useChapterDetection()

  useEffect(() => {
    storeApi.getState().setReducedMotion(detectReducedMotion())
    return subscribeToReducedMotion((v) =>
      storeApi.getState().setReducedMotion(v),
    )
  }, [storeApi])

  useEffect(() => {
    let prev = storeApi.getState()
    return storeApi.subscribe((next) => {
      if (next.activeChapterId !== prev.activeChapterId && next.activeChapterId) {
        onChapterChange?.(next.activeChapterId)
      }
      if (next.beforeAfter !== prev.beforeAfter) {
        onToggleBeforeAfter?.(next.beforeAfter)
      }
      prev = next
    })
  }, [storeApi, onChapterChange, onToggleBeforeAfter])

  useEffect(() => {
    const inactive = images.find((i) => i.variant !== beforeAfter)
    if (!inactive) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = inactive.url
    document.head.appendChild(link)
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link)
    }
  }, [images, beforeAfter])

  const beforeImg = images.find((i) => i.variant === 'before')
  const afterImg = images.find((i) => i.variant === 'after')
  if (!beforeImg || !afterImg) {
    throw new Error('SceneViewport: images must include both "before" and "after" variants')
  }

  const masterImg = beforeAfter === 'before' ? beforeImg : afterImg
  const aspectRatio = `${afterImg.width} / ${afterImg.height}`

  return (
    <section
      ref={sceneRef}
      aria-label={scene.title}
      aria-describedby={`scene-desc-${scene.id}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        background: '#0a0a0a',
      }}
    >
      <p id={`scene-desc-${scene.id}`} className="sr-only">
        Scroll to explore {scene.title}. Use the toggle to switch between historical and
        current views. Activate a marker to read about that location.
      </p>

      <MasterLayer image={beforeImg} priority={beforeAfter === 'before'} />
      <MasterLayer image={afterImg}  priority={beforeAfter === 'after'} />

      {parallaxLayers.map((layer) => (
        <ParallaxLayer key={layer.id} layer={layer} reduced={reducedMotion} sceneRef={sceneRef} />
      ))}

      {chapters.map((c) => (
        <ChapterAnchor key={c.id} chapterId={c.id} scrollAnchorY={c.scrollAnchorY} />
      ))}

      <HotspotOverlay hotspots={hotspots} {...(onHotspotOpen ? { onHotspotOpen } : {})} />

      <BeforeAfterToggle />

      {masterImg.isReconstruction && masterImg.reconstructionLabel && (
        <ReconstructionLabel label={masterImg.reconstructionLabel} />
      )}

      <div aria-live="polite" className="sr-only">
        <ChapterLiveRegion chapters={chapters} />
      </div>
    </section>
  )
}

function ChapterLiveRegion({ chapters }: { chapters: SceneEngineProps['chapters'] }) {
  const activeId = useSceneStore((s) => s.activeChapterId)
  const ch = chapters.find((c) => c.id === activeId)
  return ch ? <span>{`Now in chapter: ${ch.label}`}</span> : null
}
