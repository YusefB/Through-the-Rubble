'use client'
import type { CSSProperties } from 'react'
import type { Hotspot as HotspotData } from '@/lib/scene/types'

type Props = {
  hotspot: HotspotData
  onOpen: (id: string) => void
}

export function Hotspot({ hotspot, onOpen }: Props) {
  const { x, y, r } = hotspot.geometry
  const style: CSSProperties = {
    position: 'absolute',
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    transform: 'translate(-50%, -50%)',
    width: '48px',
    height: '48px',
    minWidth: '48px',
    minHeight: '48px',
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    pointerEvents: 'auto',
  }

  const visibleDotSize = `${Math.max(r * 100, 1)}cqw`

  return (
    <button
      type="button"
      data-hotspot-id={hotspot.id}
      aria-label={`${hotspot.label}. Activate to read story.`}
      aria-haspopup="dialog"
      onClick={() => onOpen(hotspot.id)}
      style={style}
    >
      <span
        className="hotspot-visible-dot"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: visibleDotSize,
          height: visibleDotSize,
          minWidth: '10px',
          minHeight: '10px',
          maxWidth: '32px',
          maxHeight: '32px',
          borderRadius: '50%',
          background: '#f1c155',
          boxShadow: '0 0 0 4px rgba(241,193,85,0.25)',
        }}
      />
      <span
        className="hotspot-tap-target"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />
    </button>
  )
}
