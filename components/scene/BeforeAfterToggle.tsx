'use client'
import { useSceneStore } from '@/lib/scene/SceneStoreContext'

export function BeforeAfterToggle() {
  const beforeAfter = useSceneStore((s) => s.beforeAfter)
  const toggleBeforeAfter = useSceneStore((s) => s.toggleBeforeAfter)

  return (
    <button
      type="button"
      role="switch"
      aria-checked={beforeAfter === 'before'}
      aria-label={`Showing ${beforeAfter} view. Toggle to switch.`}
      onClick={toggleBeforeAfter}
      style={{
        position: 'sticky',
        top: '14px',
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: '48px',
        minHeight: '48px',
        padding: '8px 16px',
        background: 'rgba(0,0,0,0.7)',
        color: '#ffffff',
        border: '1px solid rgba(206,17,38,0.5)',
        borderRadius: '999px',
        fontSize: '12px',
        letterSpacing: '1.5px',
        cursor: 'pointer',
        zIndex: 60,
      }}
    >
      <span style={{ opacity: beforeAfter === 'before' ? 1 : 0.4 }}>BEFORE</span>
      <span style={{ margin: '0 8px', opacity: 0.5 }}>·</span>
      <span style={{ opacity: beforeAfter === 'after' ? 1 : 0.4 }}>AFTER</span>
    </button>
  )
}
