'use client'
import { useMemo } from 'react'
import type { Hotspot as HotspotData } from '@/lib/scene/types'
import { useSceneStore } from '@/lib/scene/SceneStoreContext'
import { Hotspot } from './Hotspot'

type Props = {
  hotspots: HotspotData[]
  onHotspotOpen?: (id: string) => void
}

export function HotspotOverlay({ hotspots, onHotspotOpen }: Props) {
  const beforeAfter = useSceneStore((s) => s.beforeAfter)
  const openHotspot = useSceneStore((s) => s.openHotspot)

  const visible = useMemo(
    () =>
      hotspots.filter(
        (h) =>
          h.visualState === 'always' ||
          h.visualState === `${beforeAfter}-only`,
      ),
    [hotspots, beforeAfter],
  )

  return (
    <div
      className="hotspot-overlay"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-label="Hotspots"
    >
      {visible.map((h) => (
        <Hotspot
          key={h.id}
          hotspot={h}
          onOpen={(id) => {
            openHotspot(id)
            onHotspotOpen?.(id)
          }}
        />
      ))}
    </div>
  )
}
